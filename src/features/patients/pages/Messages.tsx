import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FiSearch, FiSend, FiMessageSquare, FiLock } from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useConversationMessages, useAppendMessage } from "@/features/messages/hooks/useMessages";
import { useMessagingSocket } from "@/features/messages/hooks/useMessagingSocket";
import { useMySessionStatus } from "@/features/messages/hooks/useChatSessions";
import { messagesApi } from "@/features/messages/api/messagesApi";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import type { Message } from "@/types";


interface Contact {
    userId: string;
    name: string;
    specialty: string;
}

function formatMsgTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string): string {
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function Messages() {
    const [activeContactId, setActiveContactId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [search, setSearch] = useState("");
    const [sessionOpen, setSessionOpen] = useState(false);
    const [unread, setUnread] = useState<Record<string, number>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeContactIdRef = useRef<string | null>(null);
    activeContactIdRef.current = activeContactId;

    const myId = useAuthStore((s) => s.user?.id ?? '');
    const { data: appointmentsData } = useAppointments();
    const { data: sessionStatus } = useMySessionStatus();

    // Sync session status from API on load
    useEffect(() => {
        if (sessionStatus !== undefined) {
            setSessionOpen(sessionStatus.isOpen);
        }
    }, [sessionStatus]);

    const contacts = useMemo<Contact[]>(() => {
        const seen = new Set<string>();
        return (appointmentsData?.appointments ?? [])
            .filter(a => {
                const uid = a.doctor?.userId;
                if (!uid || seen.has(uid)) return false;
                seen.add(uid);
                return true;
            })
            .map(a => {
                const nameParts = [a.doctor?.firstName, a.doctor?.lastName].filter(Boolean);
                const raw = nameParts.join(' ') || 'Doctor';
                return {
                    userId: a.doctor!.userId!,
                    name: raw.startsWith('Dr.') ? raw : `Dr. ${raw}`,
                    specialty: a.doctor?.specialty?.name ?? '',
                };
            });
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

    // Real-time session unlock/lock via socket
    const handleSessionChange = useCallback((isOpen: boolean) => {
        setSessionOpen(isOpen);
    }, []);

    const { sendMessage } = useMessagingSocket(handleNewMessage, handleSessionChange);

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

    return (
        <div className="animate-fade-in-up h-[calc(100vh-140px)] min-h-150 flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Messages</h1>
                <p className="text-neutral-600 font-poppins text-sm">Securely communicate with your healthcare providers.</p>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex h-full">
                {/* Contacts Sidebar */}
                <div className="w-full md:w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50 shrink-0">
                    <div className="p-4 border-b border-neutral-200">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search messages..."
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
                                <p className="font-poppins text-sm text-neutral-400">No doctors to message yet</p>
                            </div>
                        ) : (
                            filtered.map(contact => {
                                const isActive = contact.userId === activeContactId;
                                const count = unread[contact.userId] ?? 0;
                                return (
                                    <button
                                        key={contact.userId}
                                        onClick={() => setActiveContactId(contact.userId)}
                                        className={`w-full text-left p-4 flex items-start space-x-3 transition-colors border-b border-neutral-100 border-l-4 ${isActive ? "bg-primary-50 border-l-primary-500" : "hover:bg-white border-l-transparent"}`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 font-bold font-archivo text-sm shrink-0">
                                            {getInitials(contact.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-bold font-archivo truncate mb-0.5 ${isActive ? 'text-primary-900' : 'text-neutral-900'}`}>
                                                {contact.name}
                                            </h4>
                                            <p className="text-xs font-poppins text-neutral-400 truncate">{contact.specialty}</p>
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
                            <div className="h-16 px-6 border-b border-neutral-200 flex items-center shrink-0">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold font-archivo text-sm mr-3">
                                    {getInitials(activeContact.name)}
                                </div>
                                <div>
                                    <h3 className="font-bold font-archivo text-neutral-900">{activeContact.name}</h3>
                                    {activeContact.specialty && (
                                        <p className="text-xs font-poppins text-neutral-500">{activeContact.specialty}</p>
                                    )}
                                </div>
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
                                        <p className="font-poppins text-sm text-neutral-400">No messages yet</p>
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

                            {/* Input or locked state */}
                            <div className="p-4 bg-white border-t border-neutral-200 shrink-0">
                                {sessionOpen ? (
                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                                            <textarea
                                                className="w-full max-h-32 bg-transparent p-3 outline-none resize-none font-poppins text-sm"
                                                placeholder="Type your message securely..."
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
                                    <div className="flex items-center justify-center gap-2 py-3 text-sm font-poppins text-neutral-400">
                                        <FiLock className="w-4 h-4 shrink-0" />
                                        <span>Chat is available during your appointment or when your doctor starts a session.</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <FiMessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                <p className="font-poppins text-neutral-500 text-sm">Select a doctor to view messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;
