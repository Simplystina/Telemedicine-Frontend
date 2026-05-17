import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatSessionApi, type ChatSession } from '../api/chatSessionApi';

export function useDoctorSessions() {
    return useQuery({
        queryKey: ['chat-sessions'],
        queryFn: chatSessionApi.getSessions,
        staleTime: 30_000,
    });
}

export function useMySessionStatus() {
    return useQuery({
        queryKey: ['my-session-status'],
        queryFn: chatSessionApi.getMyStatus,
        staleTime: 10_000,
    });
}

export function useOpenSession() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (patientId: string) => chatSessionApi.openSession(patientId),
        onSuccess: (newSession) => {
            qc.setQueryData<ChatSession[]>(['chat-sessions'], (old) =>
                old ? [...old, newSession] : [newSession]
            );
        },
    });
}

export function useCloseSession() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (sessionId: string) => chatSessionApi.closeSession(sessionId),
        onSuccess: (_, sessionId) => {
            qc.setQueryData<ChatSession[]>(['chat-sessions'], (old) =>
                old?.map(s => s.id === sessionId ? { ...s, isOpen: false } : s)
            );
        },
    });
}
