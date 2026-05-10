import { api } from "@/services/axios";
import type {
    ConsultationSession,
    ConsultationToken,
    ConsultationNotes,
    ConsultationNotesData,
} from "@/types";

export const consultationApi = {
    createSession: async (appointmentId: string): Promise<ConsultationSession> => {
        const { data } = await api.post<ConsultationSession>(`/consultations/${appointmentId}/session`);
        return data;
    },

    getSession: async (appointmentId: string): Promise<ConsultationSession> => {
        const { data } = await api.get<ConsultationSession>(`/consultations/${appointmentId}/session`);
        return data;
    },

    getSessionToken: async (appointmentId: string): Promise<ConsultationToken> => {
        const { data } = await api.get<ConsultationToken>(`/consultations/${appointmentId}/session/token`);
        return data;
    },

    startSession: async (appointmentId: string): Promise<ConsultationSession> => {
        const { data } = await api.post<ConsultationSession>(`/consultations/${appointmentId}/session/start`);
        return data;
    },

    endSession: async (appointmentId: string): Promise<ConsultationSession> => {
        const { data } = await api.post<ConsultationSession>(`/consultations/${appointmentId}/session/end`);
        return data;
    },

    createNotes: async (appointmentId: string, payload: ConsultationNotesData): Promise<ConsultationNotes> => {
        const { data } = await api.post<ConsultationNotes>(`/consultations/${appointmentId}/notes`, payload);
        return data;
    },

    updateNotes: async (appointmentId: string, payload: ConsultationNotesData): Promise<ConsultationNotes> => {
        const { data } = await api.patch<ConsultationNotes>(`/consultations/${appointmentId}/notes`, payload);
        return data;
    },

    getNotes: async (appointmentId: string): Promise<ConsultationNotes> => {
        const { data } = await api.get<ConsultationNotes>(`/consultations/${appointmentId}/notes`);
        return data;
    },
};
