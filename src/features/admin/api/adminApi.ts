import { api } from "@/services/axios";
import type { AdminDoctor, AdminDoctorsListResponse, AdminDoctorsQueryParams, AdminDashboardStats, DoctorStatus } from "@/types";

export const adminApi = {
    getDashboardStats: async (): Promise<AdminDashboardStats> => {
        const { data } = await api.get<AdminDashboardStats>('/admin/dashboard');
        return data;
    },

    getDoctors: async (params?: AdminDoctorsQueryParams): Promise<AdminDoctorsListResponse> => {
        const { data } = await api.get<AdminDoctorsListResponse>('/admin/doctors', { params });
        return data;
    },

    getDoctorById: async (doctorId: string): Promise<AdminDoctor> => {
        const { data } = await api.get<AdminDoctor>(`/admin/doctors/${doctorId}`);
        return data;
    },

    updateDoctorStatus: async (doctorId: string, status: DoctorStatus): Promise<AdminDoctor> => {
        const { data } = await api.patch<AdminDoctor>(`/admin/doctors/${doctorId}/status`, { status });
        return data;
    },
};
