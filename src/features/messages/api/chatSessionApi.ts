import { api } from '@/services/axios';

export interface ChatSession {
    id: string;
    doctorId: string;
    patientId: string;
    isOpen: boolean;
    createdAt: string;
    closedAt?: string;
}

export interface MySessionStatus {
    isOpen: boolean;
    sessionId: string | null;
}

export const chatSessionApi = {
    // Doctor: list all their sessions
    getSessions: async (): Promise<ChatSession[]> => {
        const { data } = await api.get<ChatSession[]>('/chat/sessions');
        return data;
    },

    // Patient: check if they have an active session
    getMyStatus: async (): Promise<MySessionStatus> => {
        const { data } = await api.get<MySessionStatus>('/chat/sessions/my-status');
        return data;
    },

    // Doctor: open a session — patientId is the patient PROFILE ID (patient.id)
    openSession: async (patientId: string): Promise<ChatSession> => {
        const { data } = await api.post<ChatSession>('/chat/sessions', {
            patientId: Number(patientId),
        });
        return data;
    },

    // Doctor: close a session
    closeSession: async (sessionId: string): Promise<void> => {
        await api.patch(`/chat/sessions/${sessionId}/close`);
    },
};
