import { api } from "@/services/axios";
import type { Prescription, IssuePrescriptionData } from "@/types";

export const prescriptionApi = {
    getPrescriptions: async (): Promise<Prescription[]> => {
        const { data } = await api.get<Prescription[]>('/prescriptions');
        return data;
    },

    issuePrescription: async (appointmentId: string, payload: IssuePrescriptionData): Promise<Prescription> => {
        const { data } = await api.post<Prescription>(`/appointments/${appointmentId}/prescriptions`, payload);
        return data;
    },

    updatePrescription: async (appointmentId: string, payload: IssuePrescriptionData): Promise<Prescription> => {
        const { data } = await api.patch<Prescription>(`/appointments/${appointmentId}/prescriptions`, payload);
        return data;
    },

    getAppointmentPrescriptions: async (appointmentId: string): Promise<Prescription[]> => {
        const { data } = await api.get<Prescription[]>(`/appointments/${appointmentId}/prescriptions`);
        return data;
    },
};
