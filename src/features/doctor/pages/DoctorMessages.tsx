import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FiSearch, FiSend, FiMessageSquare, FiLock, FiUnlock, FiLoader } from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useConversationMessages, useAppendMessage } from "@/features/messages/hooks/useMessages";
import { useMessagingSocket } from "@/features/messages/hooks/useMessagingSocket";
import { useDoctorSessions, useOpenSession, useCloseSession } from "@/features/messages/hooks/useChatSessions";
import { messagesApi } from "@/features/messages/api/messagesApi";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";

import type { Message } from "@/types";

interface Contact {
    userId: string;    // used as receiverId for messages
    profileId: string; // used as patientId for session management
    name: string;
}

function formatMsgTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string): string {
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function DoctorMessages() {
    const [activeContactId, setActiveContactId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [search, setSearch] = useState("");
    const [unread, setUnread] = useState<Record<string, number>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeContactIdRef = useRef<string | null>(null);
    activeContactIdRef.current = activeContactId;

    const myId = useAuthStore((s) => s.user?.id ?? '');
    const { data: appointmentsData } = useAppointments();
    const { data: sessions = [] } = useDoctorSessions();
    const { mutateAsync: openSession, isPending: opening } = useOpenSession();
    const { mutateAsync: closeSession, isPending: closing } = useCloseSession();

    const contacts = useMemo<Contact[]>(() => {
        const seen = new Set<string>();
        return (appointmentsData?.appointments ?? [])
            .filter(a => {
                const uid = a.patient?.userId;
                if (!uid || seen.has(uid)) return false;
                seen.add(uid);
                return true;
            })
            .map(a => ({
                userId: a.patient!.userId!,
                profileId: a.patient!.id,
                name: [a.patient?.firstName, a.patient?.lastName].filter(Boolean).join(' ') || 'Patient',
            }));
    }, [appointmentsData]);

    const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(activeContactId);
    const appendMessage = useAppendMessage();

    const handleNewMessage = useCallback((msg: Message) => {
        const current = activeContactIdRef.current;
        const senderId = String(msg.senderId);
        const isMine = senderId === String(myId);
        const otherPersonId = isMine ? String(msg.receiverId) : senderId;

        if (current !== null && otherPersonId === String(current)) {
            appendMessage(current, msg);
        } else if (!isMine) {
            setUnread(prev => ({ ...prev, [senderId]: (prev[senderId] ?? 0) + 1 }));
        }
    }, [myId, appendMessage]);

    const { sendMessage } = useMessagingSocket(handleNewMessage);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (activeContactId) {
            setUnread(prev => ({ ...prev, [activeContactId]: 0 }));
            messagesApi.markAllRead().catch(() => {});
        }
    }, [activeContactId]);

    useEffect(() => {
        if (!activeContactId && contacts.length > 0) {
            setActiveContactId(contacts[0].userId);
        }
    }, [contacts, activeContactId]);

    const activeContact = contacts.find(c => c.userId === activeContactId);

    // Find the open session for this patient (matched by profile ID)
    const activeSession = activeContact
        ? sessions.find(s => String(s.patientId) === String(activeContact.profileId) && s.isOpen)
        : undefined;
    const sessionOpen = !!activeSession;

    const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const handleSend = () => {
        const text = messageInput.trim();
        if (!text || !activeContactId || !sessionOpen) return;
        sendMessage(activeContactId, text);
        setMessageInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleToggleSession = async () => {
        if (!activeContact) return;
        if (sessionOpen && activeSession) {
            await closeSession(activeSession.id);
        } else {
            await openSession(activeContact.profileId);
        }
    };

    return (
        <div className="animate-fade-in-up h-[calc(100vh-140px)] min-h-150 flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Messages</h1>
                <p className="text-neutral-600 font-poppins text-sm">Securely communicate with your patients.</p>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex h-full">
                {/* Contacts Sidebar */}
                <div className="w-full md:w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50 shrink-0">
                    <div className="p-4 border-b border-neutral-200">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="p-8 text-center">
                                <FiMessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                                <p className="font-poppins text-sm text-neutral-400">No patients to message yet</p>
                            </div>
                        ) : (
                            filtered.map(contact => {
                                const isActive = contact.userId === activeContactId;
                                const count = unread[contact.userId] ?? 0;
                                const hasSession = sessions.some(s => String(s.patientId) === String(contact.profileId) && s.isOpen);
                                return (
                                    <button
                                        key={contact.userId}
                                        onClick={() => setActiveContactId(contact.userId)}
                                        className={`w-full text-left p-4 flex items-start space-x-3 transition-colors border-b border-neutral-100 border-l-4 ${isActive ? "bg-primary-50 border-l-primary-500" : "hover:bg-white border-l-transparent"}`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 font-bold font-archivo text-sm">
                                                {getInitials(contact.name)}
                                            </div>
                                            {hasSession && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-bold font-archivo truncate mb-0.5 ${isActive ? 'text-primary-900' : 'text-neutral-900'}`}>
                                                {contact.name}
                                            </h4>
                                            <p className="text-xs font-poppins text-neutral-400">
                                                {hasSession ? 'Session active' : 'Patient'}
                                            </p>
                                        </div>
                                        {count > 0 && (
                                            <div className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                                                {count}
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="hidden md:flex flex-1 flex-col bg-white overflow-hidden">
                    {activeContact ? (
                        <>
                            {/* Header */}
                            <div className="h-16 px-6 border-b border-neutral-200 flex items-center justify-between shrink-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold font-archivo text-sm">
                                        {getInitials(activeContact.name)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold font-archivo text-neutral-900">{activeContact.name}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${sessionOpen ? 'bg-green-500' : 'bg-neutral-300'}`} />
                                            <p className={`text-xs font-poppins ${sessionOpen ? 'text-green-600' : 'text-neutral-400'}`}>
                                                {sessionOpen ? 'Session active' : 'No active session'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleToggleSession}
                                    disabled={opening || closing}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-poppins font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${sessionOpen
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                        }`}
                                >
                                    {opening || closing ? (
                                        <FiLoader className="w-3.5 h-3.5 animate-spin" />
                                    ) : sessionOpen ? (
                                        <><FiLock className="w-3.5 h-3.5" /> End Session</>
                                    ) : (
                                        <><FiUnlock className="w-3.5 h-3.5" /> Start Session</>
                                    )}
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/30">
                                {messagesLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <FiMessageSquare className="w-10 h-10 text-neutral-300 mb-2" />
                                        <p className="font-poppins text-sm text-neutral-400">
                                            {sessionOpen ? 'No messages yet. Say hello!' : 'Start a session to begin chatting with this patient.'}
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMine = String(msg.senderId) === String(myId);
                                        return (
                                            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                {!isMine && (
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold font-archivo text-xs mr-2 self-end mb-1 shrink-0">
                                                        {getInitials(activeContact.name)}
                                                    </div>
                                                )}
                                                <div className="max-w-[70%]">
                                                    <div className={`p-4 rounded-2xl ${isMine ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm shadow-sm'}`}>
                                                        <p className="font-poppins text-sm leading-relaxed">{msg.content}</p>
                                                    </div>
                                                    <p className={`text-[10px] font-poppins text-neutral-400 mt-1 ${isMine ? 'text-right' : 'text-left ml-2'}`}>
                                                        {formatMsgTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-neutral-200 shrink-0">
                                {sessionOpen ? (
                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                                            <textarea
                                                className="w-full max-h-32 bg-transparent p-3 outline-none resize-none font-poppins text-sm"
                                                placeholder="Type your message to the patient..."
                                                rows={1}
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSend}
                                            disabled={!messageInput.trim()}
                                            className="p-3 bg-primary-500 text-white hover:bg-primary-600 rounded-xl transition-colors shadow-sm shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <FiSend className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleToggleSession}
                                        disabled={opening}
                                        className="w-full py-3 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-poppins font-semibold text-sm transition-colors disabled:opacity-60"
                                    >
                                        {opening ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiUnlock className="w-4 h-4" />}
                                        Start Session to Chat
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <FiMessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                <p className="font-poppins text-neutral-500 text-sm">Select a patient to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorMessages;
