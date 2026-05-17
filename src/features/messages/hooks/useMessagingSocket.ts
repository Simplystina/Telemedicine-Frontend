import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import type { Message } from '@/types';

export function useMessagingSocket(
    onNewMessage: (msg: Message) => void,
    onSessionChange?: (isOpen: boolean) => void,
) {
    const { sendMessage, onMessage, onSessionChange: subscribeSession } = useSocket();

    const messageRef = useRef(onNewMessage);
    const sessionRef = useRef(onSessionChange);
    messageRef.current = onNewMessage;
    sessionRef.current = onSessionChange;

    useEffect(() => {
        return onMessage((msg) => messageRef.current(msg));
    }, [onMessage]);

    useEffect(() => {
        if (!onSessionChange) return;
        return subscribeSession((isOpen) => sessionRef.current?.(isOpen));
    }, [subscribeSession, onSessionChange]);

    return { sendMessage };
}
