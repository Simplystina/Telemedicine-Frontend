import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AgoraRTC, {
    type IAgoraRTCClient,
    type ICameraVideoTrack,
    type IMicrophoneAudioTrack,
    type IRemoteVideoTrack,
    type IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import {
    FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff,
    FiMessageSquare, FiUsers, FiMaximize2, FiMinimize2,
    FiWifi, FiAlertCircle
} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { useAppointment } from "@/features/appointments/hooks/useAppointments";
import { useConsultationToken } from "@/features/consultations/hooks/useConsultations";

// ── Agora config ──────────────────────────────────────────────────────────
const APP_ID = import.meta.env.VITE_AGORA_APP_ID as string;
// DEV fallback: set VITE_AGORA_TEMP_TOKEN in .env.local for local testing.
// In production the backend issues a token via /consultations/:id/session/token.
const DEV_TOKEN = (import.meta.env.VITE_AGORA_TEMP_TOKEN as string)?.trim() || null;

type CallPhase = "connecting" | "waiting" | "in-call" | "ended" | "error";

function formatDuration(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

// ── Remote user tracks (doctor side) ─────────────────────────────────────
interface RemoteUser {
    uid: string | number;
    videoTrack?: IRemoteVideoTrack;
    audioTrack?: IRemoteAudioTrack;
}

function VideoCallRoom() {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();

    const { data: appointmentData } = useAppointment(appointmentId ?? '');
    const { data: tokenData } = useConsultationToken(appointmentId ?? '');
    const doctorFullName = [appointmentData?.doctor?.firstName, appointmentData?.doctor?.lastName].filter(Boolean).join(' ');
    const doctor = {
        name: doctorFullName ? `Dr. ${doctorFullName}` : 'Doctor',
        specialty: appointmentData?.doctor?.specialty?.name ?? 'Specialist',
        imageUrl: undefined as string | undefined,
    };

    // ── State ──────────────────────────────────────────────────────────────
    const [phase, setPhase] = useState<CallPhase>("connecting");
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [remoteUser, setRemoteUser] = useState<RemoteUser | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // ── Refs ───────────────────────────────────────────────────────────────
    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const localVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);
    const localVideoTrack = useRef<ICameraVideoTrack | null>(null);
    const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Join channel ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!APP_ID || APP_ID === "YOUR_AGORA_APP_ID_HERE") {
            setErrorMsg("Agora App ID is not configured. Add VITE_AGORA_APP_ID to your .env.local file.");
            setPhase("error");
            return;
        }

        // Use real backend token when available; fall back to dev env var
        const agoraToken = tokenData?.token ?? DEV_TOKEN;
        const channelName = tokenData?.roomName ?? `appointment-${appointmentId}`;

        // If no token source at all, wait for the API response
        if (!agoraToken && !tokenData) return;

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        // ── Event: remote user publishes video/audio ──
        client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
                setRemoteUser(prev => ({ ...prev, uid: user.uid, videoTrack: user.videoTrack }));
                setPhase("in-call");
            }
            if (mediaType === "audio") {
                user.audioTrack?.play();
                setRemoteUser(prev => ({ ...prev, uid: user.uid, audioTrack: user.audioTrack }));
            }
        });

        // ── Event: remote user unpublishes ──
        client.on("user-unpublished", (_user, mediaType) => {
            if (mediaType === "video") setRemoteUser(prev => prev ? { ...prev, videoTrack: undefined } : null);
            if (mediaType === "audio") setRemoteUser(prev => prev ? { ...prev, audioTrack: undefined } : null);
        });

        // ── Event: remote user leaves ──
        client.on("user-left", () => {
            setRemoteUser(null);
            setPhase("waiting");
        });

        const join = async () => {
            try {
                setPhase("connecting");

                // ── Step 1: Request camera & mic FIRST so the browser shows the permission prompt ──
                let audioTrack: IMicrophoneAudioTrack;
                let videoTrack: ICameraVideoTrack;
                try {
                    [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                } catch (deviceErr: unknown) {
                    const name = (deviceErr as { name?: string })?.name ?? "";
                    const message = (deviceErr as { message?: string })?.message ?? "";
                    console.error("Device access error:", deviceErr);
                    if (name === "NotAllowedError" || message.includes("Permission")) {
                        setErrorMsg("Camera/microphone access was denied. Please click the camera icon in your browser's address bar, set both to 'Allow', then refresh the page.");
                    } else if (name === "NotFoundError" || message.includes("NotFound")) {
                        setErrorMsg("No camera or microphone was found on your device. Please connect a camera/mic and try again.");
                    } else if (name === "NotReadableError") {
                        setErrorMsg("Your camera or microphone is already in use by another app. Please close other apps using your camera/mic and try again.");
                    } else {
                        setErrorMsg(`Could not access your camera/microphone: ${message || name || "Unknown error"}`);
                    }
                    setPhase("error");
                    return;
                }

                localAudioTrack.current = audioTrack;
                localVideoTrack.current = videoTrack;

                // Play local video in the PiP container right away
                if (localVideoRef.current) {
                    videoTrack.play(localVideoRef.current);
                }

                // ── Step 2: Join the Agora channel ──
                try {
                    await client.join(APP_ID, channelName, agoraToken, 0);
                } catch (joinErr: unknown) {
                    const message = (joinErr as { message?: string })?.message ?? "";
                    console.error("Agora join error:", joinErr);
                    setErrorMsg(`Could not connect to the call server: ${message || "Check your internet connection and try again."}`);
                    setPhase("error");
                    audioTrack.close();
                    videoTrack.close();
                    return;
                }

                // ── Step 3: Publish tracks ──
                await client.publish([audioTrack, videoTrack]);

                setPhase("waiting"); // waiting for doctor to join
            } catch (err: unknown) {
                const message = (err as { message?: string })?.message ?? "";
                console.error("Unexpected error during call setup:", err);
                setErrorMsg(`Unexpected error: ${message || "Please refresh and try again."}`);
                setPhase("error");
            }
        };

        join();

        return () => {
            // Cleanup on unmount
            localAudioTrack.current?.close();
            localVideoTrack.current?.close();
            client.leave();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenData]);

    // ── Play remote video when remoteUser changes ──────────────────────────
    useEffect(() => {
        if (remoteUser?.videoTrack && remoteVideoRef.current) {
            remoteUser.videoTrack.play(remoteVideoRef.current);
        }
    }, [remoteUser?.videoTrack]);

    // ── Start timer when in-call ───────────────────────────────────────────
    useEffect(() => {
        if (phase === "in-call") {
            timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [phase]);

    // ── Controls ───────────────────────────────────────────────────────────
    const toggleMic = async () => {
        if (localAudioTrack.current) {
            await localAudioTrack.current.setEnabled(!micOn);
            setMicOn(v => !v);
        }
    };

    const toggleCam = async () => {
        if (localVideoTrack.current) {
            await localVideoTrack.current.setEnabled(!camOn);
            setCamOn(v => !v);
        }
    };

    const handleEndCall = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        localAudioTrack.current?.close();
        localVideoTrack.current?.close();
        await clientRef.current?.leave();
        setPhase("ended");
        setTimeout(() => navigate("/patient/appointments"), 3000);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 bg-neutral-950 flex flex-col overflow-hidden font-poppins">

            {/* ── CALL ENDED ── */}
            {phase === "ended" && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-red-900/40 flex items-center justify-center mb-6">
                        <FiPhoneOff className="w-9 h-9 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-archivo font-bold text-white mb-2">Call Ended</h2>
                    <p className="text-neutral-400 text-sm">Duration: {formatDuration(duration)}</p>
                    <p className="text-neutral-500 text-xs mt-4">Returning to appointments...</p>
                </div>
            )}

            {/* ── ERROR ── */}
            {phase === "error" && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 animate-fade-in px-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-amber-900/40 flex items-center justify-center mb-6">
                        <FiAlertCircle className="w-9 h-9 text-amber-400" />
                    </div>
                    <h2 className="text-xl font-archivo font-bold text-white mb-2">Could Not Connect</h2>
                    <p className="text-neutral-400 text-sm max-w-sm">{errorMsg}</p>
                    <button
                        onClick={() => navigate("/patient/appointments")}
                        className="mt-6 px-6 py-2.5 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        Back to Appointments
                    </button>
                </div>
            )}

            {/* ── TOP BAR ── */}
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 backdrop-blur-sm shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${phase === "in-call" ? "bg-green-400 animate-pulse" :
                        phase === "connecting" ? "bg-yellow-400 animate-pulse" :
                            "bg-neutral-500"
                        }`} />
                    <span className="text-sm text-neutral-300">
                        {phase === "connecting" && "Connecting..."}
                        {phase === "waiting" && "Waiting for doctor to join..."}
                        {phase === "in-call" && `Connected · ${formatDuration(duration)}`}
                    </span>
                    {(phase === "in-call" || phase === "waiting") && (
                        <FiWifi className="w-4 h-4 text-green-400 ml-1" />
                    )}
                </div>
                <button
                    onClick={toggleFullscreen}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                >
                    {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                </button>
            </div>

            {/* ── MAIN VIDEO AREA ── */}
            <div className="flex-1 relative flex overflow-hidden">
                <div className="flex-1 relative bg-neutral-900 flex items-center justify-center">

                    {/* Remote video (doctor) — plays real stream when available */}
                    {phase === "in-call" && remoteUser?.videoTrack ? (
                        <div ref={remoteVideoRef} className="w-full h-full object-cover" />
                    ) : (
                        /* Waiting / connecting placeholder */
                        <div className="flex flex-col items-center text-center px-8">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-neutral-700 mb-6 relative">
                                {doctor.imageUrl ? (
                                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover opacity-60" />
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                        <FaUserDoctor className="w-12 h-12 text-neutral-500" />
                                    </div>
                                )}
                                <div className="absolute inset-0 rounded-full border-4 border-primary-500/50 animate-ping" />
                            </div>
                            <h3 className="text-white font-archivo text-xl font-bold mb-1">{doctor.name}</h3>
                            <p className="text-neutral-400 text-sm mb-3">{doctor.specialty}</p>
                            <p className="text-neutral-500 text-sm">
                                {phase === "connecting" && "Establishing secure connection..."}
                                {phase === "waiting" && "Waiting for the doctor to join..."}
                            </p>
                        </div>
                    )}

                    {/* Doctor name badge (shown when in-call) */}
                    {phase === "in-call" && (
                        <div className="absolute bottom-20 left-4 bg-neutral-900/70 text-white text-xs font-poppins font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            {doctor.name}
                        </div>
                    )}

                    {/* ── Local video PiP (bottom-right) ── */}
                    <div className="absolute bottom-6 right-6 w-36 h-28 rounded-xl overflow-hidden border-2 border-neutral-700 shadow-2xl bg-neutral-800">
                        {camOn ? (
                            <div ref={localVideoRef} className="w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center">
                                <FiVideoOff className="w-6 h-6 text-neutral-500 mb-1" />
                                <p className="text-neutral-500 text-xs">Camera Off</p>
                            </div>
                        )}
                        {!micOn && (
                            <div className="absolute top-2 left-2 bg-red-600 rounded-full p-1">
                                <FiMicOff className="w-3 h-3 text-white" />
                            </div>
                        )}
                        <div className="absolute bottom-1.5 left-0 right-0 text-center">
                            <span className="text-white text-[10px] font-semibold bg-neutral-900/60 px-2 py-0.5 rounded">You</span>
                        </div>
                    </div>
                </div>

                {/* ── Chat panel ── */}
                {isChatOpen && (
                    <div className="w-72 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0">
                        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                            <span className="text-white font-semibold text-sm">In-call Chat</span>
                            <button onClick={() => setIsChatOpen(false)} className="text-neutral-400 hover:text-white text-xs">Close</button>
                        </div>
                        <div className="flex-1 p-4 flex items-center justify-center">
                            <p className="text-neutral-500 text-xs text-center">Messages during the call will appear here</p>
                        </div>
                        <div className="p-3 border-t border-neutral-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                                <button className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition-colors">Send</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── CONTROLS BAR ── */}
            <div className="shrink-0 bg-neutral-900/90 backdrop-blur-sm border-t border-neutral-800 px-6 py-5 flex items-center justify-center gap-4">
                <button
                    onClick={toggleMic}
                    title={micOn ? "Mute" : "Unmute"}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${micOn ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                >
                    {micOn ? <FiMic className="w-5 h-5" /> : <FiMicOff className="w-5 h-5" />}
                </button>

                <button
                    onClick={toggleCam}
                    title={camOn ? "Turn off camera" : "Turn on camera"}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${camOn ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                >
                    {camOn ? <FiVideo className="w-5 h-5" /> : <FiVideoOff className="w-5 h-5" />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-red-900/40"
                >
                    <FiPhoneOff className="w-5 h-5" /> End Call
                </button>

                <button
                    onClick={() => setIsChatOpen(v => !v)}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${isChatOpen ? "bg-primary-600 text-white" : "bg-neutral-700 hover:bg-neutral-600 text-white"
                        }`}
                >
                    <FiMessageSquare className="w-5 h-5" />
                </button>

                <button className="p-3.5 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-all">
                    <FiUsers className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default VideoCallRoom;
