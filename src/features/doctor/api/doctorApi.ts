import { api } from "@/services/axios";
import type {
    Doctor,
    DoctorsListResponse,
    DoctorsQueryParams,
    UpdateDoctorProfileData,
    AvailabilitySlot,
    UpdateAvailabilityData,
    Specialty,
} from "@/types";

export const doctorApi = {
    // ── Public ────────────────────────────────────────────────────────────────

    getSpecialties: async (): Promise<Specialty[]> => {
        const { data } = await api.get<Specialty[]>('/specialties');
        return data;
    },

    getDoctors: async (params?: DoctorsQueryParams): Promise<DoctorsListResponse> => {
        const { data } = await api.get<{ data: any[]; meta: { total: number; page: number; limit: number } }>('/doctors', { params });
        return {
            doctors: data.data.map((d: any) => ({
                ...d,
                email: d.user?.email ?? '',
                isVerified: d.status === 'verified',
                status: d.status,
            })),
            total: data.meta.total,
            page: data.meta.page,
            limit: data.meta.limit,
        };
    },

    getDoctorById: async (id: string): Promise<Doctor> => {
        const { data } = await api.get<any>(`/doctors/${id}`);
        return {
            ...data,
            email: data.user?.email ?? data.email ?? '',
            isVerified: data.status === 'verified',
        };
    },

    getDoctorAvailability: async (id: string): Promise<AvailabilitySlot[]> => {
        const { data } = await api.get<AvailabilitySlot[]>(`/doctors/${id}/availability`);
        return data;
    },

    // ── Doctor only ───────────────────────────────────────────────────────────

    getMyProfile: async (): Promise<Doctor> => {
        const { data } = await api.get<any>('/doctors/me');
        return {
            ...data,
            email: data.user?.email ?? data.email ?? '',
            isVerified: data.status === 'verified',
        };
    },

    updateMyProfile: async (payload: UpdateDoctorProfileData): Promise<Doctor> => {
        const { data } = await api.patch<any>('/doctors/me', payload);
        return {
            ...data,
            email: data.user?.email ?? data.email ?? '',
            isVerified: data.status === 'verified',
        };
    },

    getMyAvailability: async (): Promise<AvailabilitySlot[]> => {
        const { data } = await api.get<AvailabilitySlot[]>('/doctors/me/availability');
        return data;
    },

    saveMyAvailability: async (payload: UpdateAvailabilityData): Promise<AvailabilitySlot[]> => {
        const { data } = await api.put<AvailabilitySlot[]>('/doctors/me/availability', payload);
        return data;
    },
};
