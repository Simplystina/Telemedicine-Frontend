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
    FiMessageSquare, FiMaximize2, FiMinimize2,
    FiWifi, FiAlertCircle, FiFileText, FiInfo, FiX,
    FiCheck, FiPenTool
} from "react-icons/fi";
import ConsultationNoteModal from "../components/ConsultationNoteModal";
import { useAppointment } from "@/features/appointments/hooks/useAppointments";
import {
    useConsultationToken,
    useCreateSession,
    useStartSession,
    useEndSession,
} from "@/features/consultations/hooks/useConsultations";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

// ── Agora config ───────────────────────────────────────────────────────────
const APP_ID = import.meta.env.VITE_AGORA_APP_ID as string;
const DEV_TOKEN = (import.meta.env.VITE_AGORA_TEMP_TOKEN as string)?.trim() || null;

type CallPhase = "connecting" | "waiting" | "in-call" | "ended" | "error";

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
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();

    const { user } = useAuthStore();
    const { data: appointmentData } = useAppointment(appointmentId ?? '');
    const { data: tokenData } = useConsultationToken(appointmentId ?? '');
    const { mutate: createSession } = useCreateSession();
    const { mutate: startSession } = useStartSession();
    const { mutate: endSession } = useEndSession();

    const patientFullName = [appointmentData?.patient?.firstName, appointmentData?.patient?.lastName].filter(Boolean).join(' ');
    const patient = {
        name: patientFullName || 'Patient',
        condition: appointmentData?.reason ?? 'Consultation',
    };
    const doctorDisplayName = user?.firstName ? `Dr. ${user.firstName}` : 'Doctor';

    // ── State ──────────────────────────────────────────────────────────────
    const [phase, setPhase] = useState<CallPhase>("connecting");
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [activeTab, setActiveTab] = useState<"chat" | "history" | "notes" | null>(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [remoteUser, setRemoteUser] = useState<RemoteUser | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // ── Live Notes State ──────────────────────────────────────────────────
    const [liveNotes, setLiveNotes] = useState({ diagnosis: '', notes: '', rx: '' });

    // ── Visit History (Mock) ────────────────────────────────────────────────
    const VISIT_HISTORY = [
        { date: "Mar 29, 2026", type: "Follow-up", notes: "BP improved to 130/85. Continue current medication.", rx: "Lisinopril 10mg" },
        { date: "Mar 15, 2026", type: "Routine Check", notes: "BP slightly elevated at 145/90. Adjusted dosage.", rx: "Lisinopril 20mg" },
    ];

    // ── Refs ───────────────────────────────────────────────────────────────
    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const localVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);
    const localVideoTrack = useRef<ICameraVideoTrack | null>(null);
    const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Create session when doctor enters the room ─────────────────────────
    useEffect(() => {
        if (appointmentId) {
            createSession(appointmentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    // ── Join channel ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!APP_ID || APP_ID === "YOUR_AGORA_APP_ID_HERE") {
            setErrorMsg("Agora App ID is not configured. Add VITE_AGORA_APP_ID to your .env.local file.");
            setPhase("error");
            return;
        }

        const agoraToken = tokenData?.token ?? DEV_TOKEN;
        const channelName = tokenData?.roomName ?? `appointment-${appointmentId}`;

        if (!agoraToken && !tokenData) return;

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

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

        client.on("user-left", () => {
            setRemoteUser(null);
            setPhase("waiting");
        });

        client.on("token-privilege-will-expire", async () => {
            try {
                const res = await consultationApi.getSessionToken(appointmentId ?? '');
                await client.renewToken(res.token);
            } catch { /* if renewal fails, the did-expire event will handle it */ }
        });

        client.on("token-privilege-did-expire", () => {
            setErrorMsg("Session token expired. The call has ended.");
            setPhase("error");
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
                        setErrorMsg("Camera/microphone access was denied. Please allow access and refresh.");
                    } else if (name === "NotFoundError") {
                        setErrorMsg("No camera or microphone found. Please connect one and try again.");
                    } else if (name === "NotReadableError") {
                        setErrorMsg("Camera/microphone is already in use by another app.");
                    } else {
                        setErrorMsg(`Could not access camera/microphone: ${message || name || "Unknown error"}`);
                    }
                    setPhase("error");
                    return;
                }

                localAudioTrack.current = audioTrack;
                localVideoTrack.current = videoTrack;

                if (localVideoRef.current) {
                    videoTrack.play(localVideoRef.current);
                }

                try {
                    await client.join(APP_ID, channelName, agoraToken, 0);
                } catch (joinErr: unknown) {
                    const message = (joinErr as { message?: string })?.message ?? "";
                    setErrorMsg(`Could not connect to call server: ${message || "Check your internet connection."}`);
                    setPhase("error");
                    audioTrack.close();
                    videoTrack.close();
                    return;
                }

                await client.publish([audioTrack, videoTrack]);
                if (appointmentId) startSession(appointmentId);
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
    }, [tokenData]);

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
    };

    const handleCloseModal = () => {
        setIsNoteModalOpen(false);
        navigate("/doctor/appointments");
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

    return (
        <div className="fixed inset-0 bg-neutral-950 flex flex-col overflow-hidden font-poppins">

            {/* CALL ENDED */}
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

            {/* ERROR */}
            {phase === "error" && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 animate-fade-in px-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-amber-900/40 flex items-center justify-center mb-6">
                        <FiAlertCircle className="w-9 h-9 text-amber-400" />
                    </div>
                    <h2 className="text-xl font-archivo font-bold text-white mb-2">Could Not Connect</h2>
                    <p className="text-neutral-400 text-sm max-w-sm">{errorMsg}</p>
                    <button
                        onClick={() => navigate("/doctor/appointments")}
                        className="mt-6 px-6 py-2.5 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        Back to Appointments
                    </button>
                </div>
            )}

            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 backdrop-blur-sm shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${phase === "in-call" ? "bg-green-400 animate-pulse" :
                        phase === "connecting" ? "bg-yellow-400 animate-pulse" : "bg-neutral-500"
                        }`} />
                    <span className="text-sm text-neutral-300">
                        {phase === "connecting" && "Connecting..."}
                        {phase === "waiting" && `Waiting for ${patient.name} to join...`}
                        {phase === "in-call" && `Connected · ${formatDuration(duration)}`}
                    </span>
                    {(phase === "in-call" || phase === "waiting") && (
                        <FiWifi className="w-4 h-4 text-green-400 ml-1" />
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <span className="hidden sm:block text-xs font-poppins font-semibold text-primary-400 bg-primary-900/40 px-3 py-1 rounded-full">
                        {doctorDisplayName}
                    </span>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* MAIN VIDEO AREA */}
            <div className="flex-1 relative flex overflow-hidden">
                <div className="flex-1 relative bg-neutral-900 flex items-center justify-center">

                    {/* Remote video (patient) */}
                    {phase === "in-call" && remoteUser?.videoTrack ? (
                        <div ref={remoteVideoRef} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-center px-8">
                            <div className="w-24 h-24 rounded-full border-4 border-neutral-700 mb-6 relative bg-neutral-800 flex items-center justify-center">
                                <span className="text-3xl font-bold font-archivo text-neutral-500">
                                    {patient.name.split(" ").map(n => n[0]).join("")}
                                </span>
                                <div className="absolute inset-0 rounded-full border-4 border-primary-500/50 animate-ping" />
                            </div>
                            <h3 className="text-white font-archivo text-xl font-bold mb-1">{patient.name}</h3>
                            <p className="text-neutral-400 text-sm mb-3">{patient.condition}</p>
                            <p className="text-neutral-500 text-sm">
                                {phase === "connecting" && "Establishing secure connection..."}
                                {phase === "waiting" && "Waiting for the patient to join..."}
                            </p>
                        </div>
                    )}

                    {/* Patient name badge */}
                    {phase === "in-call" && (
                        <div className="absolute bottom-20 left-4 bg-neutral-900/70 text-white text-xs font-poppins font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            {patient.name} · {patient.condition}
                        </div>
                    )}

                    {/* Local video PiP (bottom-right) */}
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
                            <span className="text-white text-[10px] font-semibold bg-neutral-900/60 px-2 py-0.5 rounded">You (Doctor)</span>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR AREA (Chat / History / Notes) */}
                {activeTab && (
                    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0 animate-slide-in-right">
                        {/* Tabs Header */}
                        <div className="flex bg-neutral-950 border-b border-neutral-800 shrink-0">
                            {[
                                { id: 'chat', icon: FiMessageSquare, label: 'Chat' },
                                { id: 'history', icon: FiFileText, label: 'History' },
                                { id: 'notes', icon: FiPenTool, label: 'Notes' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 flex flex-col items-center py-3 border-b-2 transition-all ${
                                        activeTab === tab.id 
                                            ? "border-primary-600 bg-primary-950/20 text-primary-400" 
                                            : "border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4 mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                                </button>
                            ))}
                            <button onClick={() => setActiveTab(null)} className="px-3 text-neutral-600 hover:text-white transition-colors border-l border-neutral-800">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {activeTab === 'chat' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 p-5 flex items-center justify-center text-center">
                                        <p className="text-neutral-600 text-xs italic">Secure in-call messaging with {patient.name}...</p>
                                    </div>
                                    <div className="p-4 bg-neutral-950 border-t border-neutral-800">
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Send message..." className="flex-1 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2.5 border border-neutral-800 outline-none focus:border-primary-600" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="p-5 space-y-6">
                                    <div className="bg-neutral-800/40 rounded-xl p-4 border border-neutral-700/50">
                                        <div className="flex items-center space-x-2 mb-2 text-neutral-400">
                                            <FiInfo className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase">Patient Profile</span>
                                        </div>
                                        <h4 className="text-white font-bold text-sm tracking-tight">{patient.name}</h4>
                                        <p className="text-primary-400 text-[11px] font-bold mt-0.5">{patient.condition}</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Recent Records</h5>
                                        {VISIT_HISTORY.map((visit, i) => (
                                            <div key={i} className="relative pl-4 border-l-2 border-neutral-800 space-y-1.5">
                                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,106,232,0.6)]" />
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="font-bold text-primary-400">{visit.date}</span>
                                                    <span className="px-1.5 rounded bg-neutral-800 text-neutral-500">{visit.type}</span>
                                                </div>
                                                <p className="text-[11px] text-neutral-300 leading-relaxed italic line-clamp-2">"{visit.notes}"</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveTab('notes')} className="w-full py-3 bg-primary-900/30 text-primary-400 border border-primary-900/50 rounded-xl text-xs font-bold hover:bg-primary-900/50 transition-all flex items-center justify-center space-x-2">
                                        <FiPenTool className="w-3.5 h-3.5" />
                                        <span>Start New Entry</span>
                                    </button>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div className="p-5 space-y-5 animate-fade-in">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Primary Diagnosis</label>
                                        <input 
                                            value={liveNotes.diagnosis}
                                            onChange={e => setLiveNotes({...liveNotes, diagnosis: e.target.value})}
                                            placeholder="Enter diagnosis..." 
                                            className="w-full bg-neutral-950 text-white text-sm rounded-xl px-4 py-3 border border-neutral-800 outline-none focus:border-primary-600 transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Clinical Observations</label>
                                        <textarea 
                                            value={liveNotes.notes}
                                            onChange={e => setLiveNotes({...liveNotes, notes: e.target.value})}
                                            placeholder="Type clinical observations during call..." 
                                            className="w-full bg-neutral-950 text-white text-sm rounded-xl px-4 py-3 border border-neutral-800 outline-none focus:border-primary-600 h-40 resize-none transition-all custom-scrollbar" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Prescription / Plan</label>
                                        <input 
                                            value={liveNotes.rx}
                                            onChange={e => setLiveNotes({...liveNotes, rx: e.target.value})}
                                            placeholder="Treatment or medication..." 
                                            className="w-full bg-neutral-950 text-white text-sm rounded-xl px-4 py-3 border border-neutral-800 outline-none focus:border-primary-600 transition-all" 
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-neutral-800">
                                        <div className="flex items-center space-x-2 text-[10px] text-green-500 font-bold bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                                            <FiCheck className="w-3.5 h-3.5 animate-pulse" />
                                            <span>Draft Auto-saving...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* CONTROLS BAR */}
            <div className="shrink-0 bg-neutral-900/90 backdrop-blur-sm border-t border-neutral-800 px-6 py-5 flex items-center justify-center gap-4">
                <button
                    onClick={toggleMic}
                    title={micOn ? "Mute" : "Unmute"}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${micOn ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                >
                    {micOn ? <FiMic className="w-5 h-5" /> : <FiMicOff className="w-5 h-5" />}
                </button>

                <button
                    onClick={toggleCam}
                    title={camOn ? "Turn off camera" : "Turn on camera"}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${camOn ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                >
                    {camOn ? <FiVideo className="w-5 h-5" /> : <FiVideoOff className="w-5 h-5" />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-red-900/40 mx-2"
                >
                    <FiPhoneOff className="w-5 h-5" /> End Call
                </button>

                <button
                    onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${activeTab === 'chat' ? "bg-primary-600 text-white" : "bg-neutral-700 hover:bg-neutral-600 text-white"}`}
                    title="Toggle Chat"
                >
                    <FiMessageSquare className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setActiveTab(activeTab === 'history' ? null : 'history')}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${activeTab === 'history' ? "bg-primary-600 text-white" : "bg-neutral-700 hover:bg-neutral-600 text-white"}`}
                    title="View Patient History"
                >
                    <FiFileText className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setActiveTab(activeTab === 'notes' ? null : 'notes')}
                    className={`p-3.5 rounded-full flex items-center justify-center transition-all ${activeTab === 'notes' ? "bg-accent-600 text-white" : "bg-neutral-700 hover:bg-neutral-600 text-white"}`}
                    title="Live Note Recording"
                >
                    <FiPenTool className="w-5 h-5" />
                </button>
            </div>

            {/* Post-Call Summary Modal Integration */}
            <ConsultationNoteModal
                isOpen={isNoteModalOpen}
                onClose={handleCloseModal}
                patientName={patient.name}
                appointmentId={appointmentId ?? ''}
            />
        </div>
    );
}

export default DoctorVideoCallRoom;
