import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { consultationApi } from "../api/consultationApi";
import type { ConsultationNotesData } from "@/types";

// ── Session ───────────────────────────────────────────────────────────────────

export const useConsultationSession = (appointmentId: string) => {
    return useQuery({
        queryKey: ['consultation-session', appointmentId],
        queryFn: () => consultationApi.getSession(appointmentId),
        enabled: !!appointmentId,
    });
};

export const useConsultationToken = (appointmentId: string) => {
    return useQuery({
        queryKey: ['consultation-token', appointmentId],
        queryFn: () => consultationApi.getSessionToken(appointmentId),
        enabled: !!appointmentId,
        retry: 6,
        retryDelay: 3000,
    });
};

export const useCreateSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (appointmentId: string) => consultationApi.createSession(appointmentId),
        onSuccess: (session) => {
            queryClient.invalidateQueries({ queryKey: ['consultation-session', session.appointmentId] });
            // Token query may have fired before session existed — trigger a refetch now
            queryClient.invalidateQueries({ queryKey: ['consultation-token', session.appointmentId] });
        },
    });
};

export const useStartSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (appointmentId: string) => consultationApi.startSession(appointmentId),
        onSuccess: (session) => {
            queryClient.invalidateQueries({ queryKey: ['consultation-session', session.appointmentId] });
        },
    });
};

export const useEndSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (appointmentId: string) => consultationApi.endSession(appointmentId),
        onSuccess: (session) => {
            queryClient.invalidateQueries({ queryKey: ['consultation-session', session.appointmentId] });
            queryClient.invalidateQueries({ queryKey: ['appointment', session.appointmentId] });
        },
    });
};

// ── Notes ─────────────────────────────────────────────────────────────────────

export const useConsultationNotes = (appointmentId: string) => {
    return useQuery({
        queryKey: ['consultation-notes', appointmentId],
        queryFn: () => consultationApi.getNotes(appointmentId),
        enabled: !!appointmentId,
    });
};

export const useCreateNotes = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appointmentId, ...payload }: ConsultationNotesData & { appointmentId: string }) =>
            consultationApi.createNotes(appointmentId, payload),
        onSuccess: (notes) => {
            queryClient.invalidateQueries({ queryKey: ['consultation-notes', notes.appointmentId] });
            toast.success('Notes saved!');
        },
    });
};

export const useUpdateNotes = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appointmentId, ...payload }: ConsultationNotesData & { appointmentId: string }) =>
            consultationApi.updateNotes(appointmentId, payload),
        onSuccess: (notes) => {
            queryClient.invalidateQueries({ queryKey: ['consultation-notes', notes.appointmentId] });
            toast.success('Notes updated!');
        },
    });
};
