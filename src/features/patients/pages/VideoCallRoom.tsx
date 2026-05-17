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
    FiWifi, FiWifiOff, FiAlertCircle, FiRefreshCw, FiLogIn,
} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { useAppointment } from "@/features/appointments/hooks/useAppointments";
import { useConsultationToken } from "@/features/consultations/hooks/useConsultations";
import { useCallStore } from "../../consultations/store/useCallStore";

const DEV_TOKEN = (import.meta.env.VITE_AGORA_TEMP_TOKEN as string)?.trim() || null;

type CallPhase = "connecting" | "waiting" | "in-call" | "left" | "ended" | "error";
type ConnectionStatus = "connected" | "reconnecting" | "disconnected";

function formatDuration(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

interface RemoteUser {
    uid: string | number;
    videoTrack?: IRemoteVideoTrack;
    audioTrack?: IRemoteAudioTrack;
}

function VideoCallRoom() {
    const { appointmentId: routeAppointmentId } = useParams<{ appointmentId: string }>();
    const { activeCallId, isMinimized, startCall, endCall: endGlobalCall, minimize, maximize } = useCallStore();
    const appointmentId = routeAppointmentId || activeCallId;
    const navigate = useNavigate();

    const { data: appointmentData } = useAppointment(appointmentId ?? '');
    const { data: tokenData, refetch: refetchToken } = useConsultationToken(appointmentId ?? '');

    const doctorFullName = [appointmentData?.doctor?.firstName, appointmentData?.doctor?.lastName].filter(Boolean).join(' ');
    const doctor = {
        name: doctorFullName ? `Dr. ${doctorFullName}` : 'Doctor',
        specialty: appointmentData?.doctor?.specialty?.name ?? 'Specialist',
    };

    const [phase, setPhase] = useState<CallPhase>("connecting");
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [remoteUser, setRemoteUser] = useState<RemoteUser | null>(null);
    const [remoteUsers, setRemoteUsers] = useState<Set<number>>(new Set());
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected");
    const [showWaiting, setShowWaiting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [rejoinKey, setRejoinKey] = useState(0);

    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const localVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);
    const localVideoTrack = useRef<ICameraVideoTrack | null>(null);
    const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (appointmentId && !activeCallId) startCall(appointmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId, activeCallId]);

    useEffect(() => {
        // Don't auto-join again if patient manually left — they must click Rejoin
        if (phase === "left") return;

        const agoraToken = tokenData?.token ?? DEV_TOKEN;
        const appId = tokenData?.appId;
        const channelName = tokenData?.roomName ?? `appointment-${appointmentId}`;

        if (!agoraToken || !appId) return;

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("user-joined", (user) => {
            setRemoteUsers(prev => new Set(prev).add(user.uid as number));
        });

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

        client.on("user-unpublished", (_user, mediaType) => {
            if (mediaType === "video") setRemoteUser(prev => prev ? { ...prev, videoTrack: undefined } : null);
            if (mediaType === "audio") setRemoteUser(prev => prev ? { ...prev, audioTrack: undefined } : null);
        });

        client.on("user-left", (user) => {
            setRemoteUsers(prev => {
                const next = new Set(prev);
                next.delete(user.uid as number);
                return next;
            });
            setRemoteUser(null);
            setPhase("waiting");
        });

        client.on("connection-state-change", (curState) => {
            if (curState === "RECONNECTING") setConnectionStatus("reconnecting");
            else if (curState === "CONNECTED") setConnectionStatus("connected");
            else if (curState === "DISCONNECTED") setConnectionStatus("disconnected");
        });

        const join = async () => {
            try {
                setPhase("connecting");
                let audioTrack: IMicrophoneAudioTrack;
                let videoTrack: ICameraVideoTrack;
                try {
                    [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                } catch (deviceErr: unknown) {
                    const name = (deviceErr as { name?: string })?.name ?? "";
                    const message = (deviceErr as { message?: string })?.message ?? "";
                    if (name === "NotAllowedError" || message.includes("Permission")) {
                        setErrorMsg("Camera/microphone access was denied.");
                    } else if (name === "NotFoundError" || message.includes("NotFound")) {
                        setErrorMsg("No camera or microphone was found.");
                    } else {
                        setErrorMsg(`Could not access camera/microphone: ${message || name || "Unknown error"}`);
                    }
                    setPhase("error");
                    return;
                }

                localAudioTrack.current = audioTrack;
                localVideoTrack.current = videoTrack;
                if (localVideoRef.current) videoTrack.play(localVideoRef.current);

                try {
                    await client.join(appId, channelName, agoraToken, 0);
                } catch (joinErr: unknown) {
                    const message = (joinErr as { message?: string })?.message ?? "";
                    setErrorMsg(`Could not connect: ${message || "Check your internet connection."}`);
                    setPhase("error");
                    audioTrack.close();
                    videoTrack.close();
                    return;
                }

                await client.publish([audioTrack, videoTrack]);
                setPhase("waiting");
            } catch (err: unknown) {
                const message = (err as { message?: string })?.message ?? "";
                setErrorMsg(`Unexpected error: ${message || "Please refresh and try again."}`);
                setPhase("error");
            }
        };

        join();

        return () => {
            localAudioTrack.current?.close();
            localVideoTrack.current?.close();
            client.leave();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenData, appointmentId, rejoinKey]);

    // 60-second grace period before showing "waiting for doctor" message
    useEffect(() => {
        if (remoteUsers.size === 0 && phase === "waiting") {
            const t = setTimeout(() => setShowWaiting(true), 60_000);
            return () => clearTimeout(t);
        } else {
            setShowWaiting(false);
        }
    }, [remoteUsers, phase]);

    useEffect(() => {
        if (remoteUser?.videoTrack && remoteVideoRef.current) {
            remoteUser.videoTrack.play(remoteVideoRef.current);
        }
    }, [remoteUser?.videoTrack]);

    useEffect(() => {
        if (phase === "in-call") {
            timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [phase]);

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

    // Patient only leaves Agora — does NOT call endSession. Doctor ends the appointment.
    const handleLeave = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        localAudioTrack.current?.close();
        localVideoTrack.current?.close();
        await clientRef.current?.leave();
        setPhase("left");
    };

    const handleRejoin = async () => {
        setConnectionStatus("connected");
        setPhase("connecting");
        await refetchToken();
        setRejoinKey(k => k + 1);
    };

    const handleDisconnectedRejoin = async () => {
        setConnectionStatus("connected");
        await refetchToken();
        setRejoinKey(k => k + 1);
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

    if (!appointmentId) return null;

    return (
        <div className={`fixed z-100 transition-all duration-500 ease-in-out font-poppins shadow-2xl ${
            isMinimized
                ? "bottom-6 right-6 w-80 h-60 rounded-3xl overflow-hidden border-2 border-primary-500/30 bg-neutral-900"
                : "inset-0 bg-neutral-950 flex flex-col"
        }`}>

            {/* Reconnecting overlay */}
            {connectionStatus === "reconnecting" && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-950/70 backdrop-blur-sm pointer-events-none">
                    <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl px-6 py-4">
                        <FiWifi className="w-5 h-5 text-amber-400 animate-pulse" />
                        <span className="text-amber-300 font-semibold text-sm">Reconnecting...</span>
                    </div>
                </div>
            )}

            {/* Disconnected overlay */}
            {connectionStatus === "disconnected" && phase !== "left" && phase !== "ended" && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-red-900/40 flex items-center justify-center mb-4">
                        <FiWifiOff className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-white font-archivo font-bold text-lg mb-1">Connection Lost</p>
                    <p className="text-neutral-400 text-sm mb-6">Your internet connection was interrupted.</p>
                    <button
                        onClick={handleDisconnectedRejoin}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
                    >
                        <FiRefreshCw className="w-4 h-4" /> Rejoin Call
                    </button>
                </div>
            )}

            {/* Minimized controls */}
            {isMinimized && (
                <div className="absolute top-3 right-3 z-110 flex gap-2">
                    <button onClick={maximize} className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg">
                        <FiMaximize2 className="w-4 h-4" />
                    </button>
                    <button onClick={handleLeave} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg">
                        <FiPhoneOff className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Patient left screen */}
            {phase === "left" && !isMinimized && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 animate-fade-in px-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                        <FiPhoneOff className="w-9 h-9 text-neutral-400" />
                    </div>
                    <h2 className="text-2xl font-archivo font-bold text-white mb-2">You Left the Call</h2>
                    <p className="text-neutral-400 text-sm mb-6 max-w-xs">
                        The session is still active. You can rejoin at any time until the doctor ends it.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRejoin}
                            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
                        >
                            <FiLogIn className="w-4 h-4" /> Rejoin Call
                        </button>
                        <button
                            onClick={() => { endGlobalCall(); navigate("/patient/appointments"); }}
                            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-semibold transition-colors"
                        >
                            Back to Appointments
                        </button>
                    </div>
                </div>
            )}

            {/* Ended screen */}
            {phase === "ended" && !isMinimized && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-red-900/40 flex items-center justify-center mb-6">
                        <FiPhoneOff className="w-9 h-9 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-archivo font-bold text-white mb-2">Call Ended</h2>
                    <p className="text-neutral-400 text-sm">Duration: {formatDuration(duration)}</p>
                    <p className="text-neutral-500 text-xs mt-4">Returning to appointments...</p>
                </div>
            )}

            {/* Error screen */}
            {phase === "error" && !isMinimized && (
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

            {/* Header */}
            {!isMinimized && (
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 backdrop-blur-sm shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${phase === "in-call" ? "bg-green-400 animate-pulse" : phase === "connecting" ? "bg-yellow-400 animate-pulse" : "bg-neutral-500"}`} />
                        <span className="text-sm text-neutral-300">
                            {phase === "connecting" && "Connecting..."}
                            {phase === "waiting" && (showWaiting ? "Waiting for the doctor..." : "In room — doctor will join soon")}
                            {phase === "in-call" && `Connected · ${formatDuration(duration)}`}
                        </span>
                        {(phase === "in-call" || phase === "waiting") && <FiWifi className="w-4 h-4 text-green-400 ml-1" />}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={minimize} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors" title="Minimize Call">
                            <FiMinimize2 className="w-4 h-4" />
                        </button>
                        <button onClick={toggleFullscreen} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                            {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Main video area */}
            <div className={`flex-1 relative flex overflow-hidden ${isMinimized ? "p-0" : ""}`}>
                <div className="flex-1 relative bg-neutral-900 flex items-center justify-center">
                    {(phase === "in-call" && remoteUser?.videoTrack) ? (
                        <div ref={remoteVideoRef} className="w-full h-full object-cover" />
                    ) : (
                        <div className={`flex flex-col items-center text-center px-8 ${isMinimized ? "scale-75" : ""}`}>
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-neutral-700 mb-6 relative">
                                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                    <FaUserDoctor className="w-12 h-12 text-neutral-500" />
                                </div>
                                <div className="absolute inset-0 rounded-full border-4 border-primary-500/50 animate-ping" />
                            </div>
                            {!isMinimized && (
                                <>
                                    <h3 className="text-white font-archivo text-xl font-bold mb-1">{doctor.name}</h3>
                                    <p className="text-neutral-400 text-sm mb-3">{doctor.specialty}</p>
                                    <p className="text-neutral-500 text-sm">
                                        {phase === "connecting" && "Establishing secure connection..."}
                                        {phase === "waiting" && (showWaiting ? "Waiting for the doctor to join..." : "You're in the room — doctor will join shortly")}
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {phase === "in-call" && !isMinimized && (
                        <div className="absolute bottom-20 left-4 bg-neutral-900/70 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            {doctor.name}
                        </div>
                    )}

                    {!isMinimized && (
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
                    )}
                </div>

                {isChatOpen && !isMinimized && (
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
                                <input type="text" placeholder="Type a message..." className="flex-1 bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                                <button className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition-colors">Send</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls — patient leaves (does not end the session) */}
            {!isMinimized && (
                <div className="shrink-0 bg-neutral-900/90 backdrop-blur-sm border-t border-neutral-800 px-6 py-5 flex items-center justify-center gap-4">
                    <button onClick={toggleMic} className={`p-3.5 rounded-full flex items-center justify-center transition-all ${micOn ? "bg-neutral-700 hover:bg-neutral-600" : "bg-red-600 hover:bg-red-700"} text-white`}>
                        {micOn ? <FiMic className="w-5 h-5" /> : <FiMicOff className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleCam} className={`p-3.5 rounded-full flex items-center justify-center transition-all ${camOn ? "bg-neutral-700 hover:bg-neutral-600" : "bg-red-600 hover:bg-red-700"} text-white`}>
                        {camOn ? <FiVideo className="w-5 h-5" /> : <FiVideoOff className="w-5 h-5" />}
                    </button>
                    <button onClick={handleLeave} className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-red-900/40">
                        <FiPhoneOff className="w-5 h-5" /> Leave Call
                    </button>
                    <button onClick={() => setIsChatOpen(v => !v)} className={`p-3.5 rounded-full flex items-center justify-center transition-all ${isChatOpen ? "bg-primary-600" : "bg-neutral-700 hover:bg-neutral-600"} text-white`}>
                        <FiMessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-3.5 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-all">
                        <FiUsers className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default VideoCallRoom;
