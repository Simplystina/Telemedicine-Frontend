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
    FiMessageSquare, FiMaximize2, FiMinimize2, FiX,
    FiWifi, FiWifiOff, FiRefreshCw,
} from "react-icons/fi";
import ConsultationNoteModal from "@/features/doctor/components/ConsultationNoteModal";
import { useAppointment } from "@/features/appointments/hooks/useAppointments";
import {
    useConsultationToken,
    useCreateSession,
    useStartSession,
    useEndSession,
} from "@/features/consultations/hooks/useConsultations";
import { useCallStore } from "@/features/consultations/store/useCallStore";

const DEV_TOKEN = (import.meta.env.VITE_AGORA_TEMP_TOKEN as string)?.trim() || null;

type CallPhase = "connecting" | "waiting" | "in-call" | "ended" | "error";
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

function DoctorVideoCallRoom() {
    const { appointmentId: routeAppointmentId } = useParams<{ appointmentId: string }>();
    const { activeCallId, isMinimized, startCall, endCall: endGlobalCall, minimize, maximize } = useCallStore();
    const appointmentId = routeAppointmentId || activeCallId;
    const navigate = useNavigate();

    const { data: appointmentData } = useAppointment(appointmentId ?? '');
    const { data: tokenData, refetch: refetchToken } = useConsultationToken(appointmentId ?? '');
    const { mutate: createSession } = useCreateSession();
    const { mutate: startSession } = useStartSession();
    const { mutate: endSession } = useEndSession();

    const patientFullName = [appointmentData?.patient?.firstName, appointmentData?.patient?.lastName].filter(Boolean).join(' ');
    const patient = { name: patientFullName || 'Patient', condition: appointmentData?.reason ?? 'Consultation' };

    const [phase, setPhase] = useState<CallPhase>("connecting");
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [activeTab, setActiveTab] = useState<"chat" | null>(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [remoteUser, setRemoteUser] = useState<RemoteUser | null>(null);
    const [remoteUsers, setRemoteUsers] = useState<Set<number>>(new Set());
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected");
    const [showWaiting, setShowWaiting] = useState(false);
    const [rejoinKey, setRejoinKey] = useState(0);

    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const localVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);
    const localVideoTrack = useRef<ICameraVideoTrack | null>(null);
    const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (appointmentId) {
            createSession(appointmentId);
            if (!activeCallId) startCall(appointmentId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    useEffect(() => {
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
                } catch {
                    setPhase("error");
                    return;
                }

                localAudioTrack.current = audioTrack;
                localVideoTrack.current = videoTrack;
                if (localVideoRef.current) videoTrack.play(localVideoRef.current);

                try {
                    await client.join(appId, channelName, agoraToken, 0);
                } catch {
                    setPhase("error");
                    audioTrack.close();
                    videoTrack.close();
                    return;
                }

                await client.publish([audioTrack, videoTrack]);
                if (appointmentId) startSession(appointmentId);
                setPhase("waiting");
            } catch {
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

    // 60-second grace period before showing "waiting for patient" message
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

    const handleEndCall = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        localAudioTrack.current?.close();
        localVideoTrack.current?.close();
        await clientRef.current?.leave();
        if (appointmentId) endSession(appointmentId);
        setPhase("ended");
        setIsNoteModalOpen(true);
        endGlobalCall();
    };

    const handleRejoin = async () => {
        setConnectionStatus("connected");
        await refetchToken();
        setRejoinKey(k => k + 1);
    };

    const handleCloseModal = () => {
        setIsNoteModalOpen(false);
        if (routeAppointmentId) navigate("/doctor/appointments");
    };

    if (!appointmentId) return null;

    return (
        <div className={`fixed z-50 transition-all duration-500 ease-in-out font-poppins shadow-2xl ${
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
            {connectionStatus === "disconnected" && phase !== "ended" && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-red-900/40 flex items-center justify-center mb-4">
                        <FiWifiOff className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-white font-archivo font-bold text-lg mb-1">Connection Lost</p>
                    <p className="text-neutral-400 text-sm mb-6">Your internet connection was interrupted.</p>
                    <button
                        onClick={handleRejoin}
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
                    <button onClick={handleEndCall} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg">
                        <FiPhoneOff className="w-4 h-4" />
                    </button>
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
                </div>
            )}

            {/* Header */}
            {!isMinimized && (
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 backdrop-blur-sm shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${phase === "in-call" ? "bg-green-400 animate-pulse" : "bg-neutral-500"}`} />
                        <span className="text-sm text-neutral-300">
                            {phase === "in-call" ? `Connected · ${formatDuration(duration)}` :
                                phase === "waiting" ? "In room — waiting for patient..." : "Connecting..."}
                        </span>
                    </div>
                    <button onClick={minimize} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                        <FiMinimize2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Main video area */}
            <div className={`flex-1 relative flex overflow-hidden ${isMinimized ? "p-0" : ""}`}>
                <div className="flex-1 relative bg-neutral-900 flex items-center justify-center">
                    {(phase === "in-call" && remoteUser?.videoTrack) ? (
                        <div ref={remoteVideoRef} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full border-4 border-neutral-700 mb-6 bg-neutral-800 flex items-center justify-center">
                                <span className="text-3xl font-bold font-archivo text-neutral-500">{patient.name[0]}</span>
                            </div>
                            <h3 className="text-white font-archivo text-xl font-bold">{patient.name}</h3>
                            {showWaiting && phase === "waiting" && (
                                <p className="text-neutral-500 text-sm mt-2">Patient hasn't joined yet...</p>
                            )}
                        </div>
                    )}

                    {!isMinimized && (
                        <div className="absolute bottom-6 right-6 w-36 h-28 rounded-xl overflow-hidden border-2 border-neutral-700 shadow-2xl bg-neutral-800">
                            {camOn
                                ? <div ref={localVideoRef} className="w-full h-full" />
                                : <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><FiVideoOff className="w-6 h-6 text-neutral-500" /></div>}
                        </div>
                    )}
                </div>

                {activeTab && !isMinimized && (
                    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col">
                        <div className="flex bg-neutral-950 border-b border-neutral-800">
                            <button className="flex-1 py-3 text-xs font-bold uppercase text-primary-400">Chat</button>
                            <button onClick={() => setActiveTab(null)} className="px-3 text-neutral-600 hover:text-white"><FiX className="w-4 h-4" /></button>
                        </div>
                        <div className="flex-1 p-5">
                            <p className="text-neutral-600 text-xs italic">Secure messaging enabled...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls — doctor only has End Call */}
            {!isMinimized && (
                <div className="shrink-0 bg-neutral-900/90 backdrop-blur-sm border-t border-neutral-800 px-6 py-5 flex items-center justify-center gap-4">
                    <button onClick={toggleMic} className={`p-3.5 rounded-full ${micOn ? "bg-neutral-700" : "bg-red-600"} text-white`}>
                        {micOn ? <FiMic className="w-5 h-5" /> : <FiMicOff className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleCam} className={`p-3.5 rounded-full ${camOn ? "bg-neutral-700" : "bg-red-600"} text-white`}>
                        {camOn ? <FiVideo className="w-5 h-5" /> : <FiVideoOff className="w-5 h-5" />}
                    </button>
                    <button onClick={handleEndCall} className="px-8 py-3.5 bg-red-600 text-white rounded-full font-semibold flex items-center gap-2">
                        <FiPhoneOff className="w-5 h-5" /> End Call
                    </button>
                    <button
                        onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
                        className={`p-3.5 rounded-full ${activeTab === 'chat' ? "bg-primary-600" : "bg-neutral-700"} text-white`}
                    >
                        <FiMessageSquare className="w-5 h-5" />
                    </button>
                </div>
            )}

            <ConsultationNoteModal
                isOpen={isNoteModalOpen}
                onClose={handleCloseModal}
                patientName={patient.name}
                appointmentId={appointmentId ?? ''}
                patientId={String(appointmentData?.patientId || '')}
            />
        </div>
    );
}

export default DoctorVideoCallRoom;
