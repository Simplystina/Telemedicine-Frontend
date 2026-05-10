import { api } from "@/services/axios";
import type { PatientProfile, UpdatePatientProfileData } from "@/types";

export const patientApi = {
    getMyProfile: async (): Promise<PatientProfile> => {
        const { data } = await api.get<PatientProfile>('/patients/me');
        return data;
    },

    updateMyProfile: async (payload: UpdatePatientProfileData): Promise<PatientProfile> => {
        const { data } = await api.patch<PatientProfile>('/patients/me', payload);
        return data;
    },
};
