import { createContext, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import type { Message } from '@/types';

const SOCKET_URL = ((import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api/v1').replace(/\/api\/v\d+$/, '');

// ── Module-level singletons ──────────────────────────────────────────────────
// Listener sets live at module level so socket event handlers never capture
// stale refs (avoids React StrictMode double-mount closure bug).

type MessageListener = (msg: Message) => void;
type SessionListener = (isOpen: boolean) => void;

const messageListeners = new Set<MessageListener>();
const sessionListeners = new Set<SessionListener>();
let sharedSocket: Socket | null = null;
let sharedToken: string | null = null;

function ensureSocket(token: string) {
    if (sharedSocket?.connected && sharedToken === token) return;
    sharedSocket?.disconnect();

    const socket = io(`${SOCKET_URL}/messaging`, {
        auth: { token },
        reconnectionAttempts: 10,
    });

    socket.on('newMessage', (msg: Message) => {
        messageListeners.forEach((l) => l(msg));
    });
    socket.on('sessionOpened', () => {
        sessionListeners.forEach((l) => l(true));
    });
    socket.on('sessionClosed', () => {
        sessionListeners.forEach((l) => l(false));
    });

    sharedSocket = socket;
    sharedToken = token;
}

function destroySocket() {
    sharedSocket?.disconnect();
    sharedSocket = null;
    sharedToken = null;
}

function sendMessage(receiverId: string, content: string, type = 'text') {
    if (sharedSocket && !sharedSocket.connected && sharedToken) {
        sharedSocket.connect();
    }
    sharedSocket?.emit('sendMessage', {
        receiverId: Number(receiverId),
        type,
        content,
    });
}

// ── Context ──────────────────────────────────────────────────────────────────

interface SocketContextValue {
    sendMessage: typeof sendMessage;
    onMessage: (listener: MessageListener) => () => void;
    onSessionChange: (listener: SessionListener) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
    const token = useAuthStore((s) => s.user?.token);

    useEffect(() => {
        if (!token) {
            destroySocket();
            return;
        }
        ensureSocket(token);
    }, [token]);

    const onMessage = useCallback((listener: MessageListener) => {
        messageListeners.add(listener);
        return () => { messageListeners.delete(listener); };
    }, []);

    const onSessionChange = useCallback((listener: SessionListener) => {
        sessionListeners.add(listener);
        return () => { sessionListeners.delete(listener); };
    }, []);

    return (
        <SocketContext.Provider value={{ sendMessage, onMessage, onSessionChange }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocket must be used within SocketProvider');
    return ctx;
}
