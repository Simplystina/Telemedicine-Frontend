import { api } from "@/services/axios";
import type {
    AdminDoctor, AdminDoctorsListResponse, AdminDoctorsQueryParams, AdminDashboardStats, DoctorStatus,
    AdminPatient, AdminPatientsListResponse, AdminPatientsQueryParams,
    AdminAppointmentsListResponse, AdminAppointmentsQueryParams,
    Appointment, Specialty,
} from "@/types";

export const adminApi = {
    getDashboardStats: async (): Promise<AdminDashboardStats> => {
        const { data } = await api.get<AdminDashboardStats>('/admin/dashboard');
        return data;
    },

    // ── Doctors ──────────────────────────────────────────────────────────────
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

    // ── Patients ─────────────────────────────────────────────────────────────
    getPatients: async (params?: AdminPatientsQueryParams): Promise<AdminPatientsListResponse> => {
        const { data } = await api.get<AdminPatientsListResponse>('/admin/patients', { params });
        return data;
    },
    getPatientById: async (patientId: string): Promise<AdminPatient> => {
        const { data } = await api.get<AdminPatient>(`/admin/patients/${patientId}`);
        return data;
    },
    deactivateUser: async (userId: string): Promise<void> => {
        await api.patch(`/admin/users/${userId}/deactivate`);
    },
    activateUser: async (userId: string): Promise<void> => {
        await api.patch(`/admin/users/${userId}/activate`);
    },

    // ── Appointments ─────────────────────────────────────────────────────────
    getAppointments: async (params?: AdminAppointmentsQueryParams): Promise<AdminAppointmentsListResponse> => {
        const { data } = await api.get<AdminAppointmentsListResponse>('/admin/appointments', { params });
        return data;
    },
    getAppointmentById: async (appointmentId: string): Promise<Appointment> => {
        const { data } = await api.get<Appointment>(`/admin/appointments/${appointmentId}`);
        return data;
    },

    // ── Specialties ──────────────────────────────────────────────────────────
    getSpecialties: async (): Promise<Specialty[]> => {
        const { data } = await api.get<Specialty[]>('/specialties');
        return data;
    },
    createSpecialty: async (name: string): Promise<Specialty> => {
        const { data } = await api.post<Specialty>('/specialties', { name });
        return data;
    },
    deleteSpecialty: async (id: string): Promise<void> => {
        await api.delete(`/specialties/${id}`);
    },
};
