import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { adminApi } from "../api/adminApi";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import type { LoginCredentials, AdminDoctorsQueryParams, AdminPatientsQueryParams, AdminAppointmentsQueryParams, DoctorStatus, AuthUser } from "@/types";

export const useAdminLogin = () => {
    const navigate = useNavigate();
    const { setUser, setRefreshToken } = useAuthStore();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.adminLogin(credentials),
        onSuccess: (data) => {
            setUser({ ...data.user, token: data.accessToken } as AuthUser);
            setRefreshToken(data.refreshToken);
            navigate('/admin');
        },
    });
};

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: () => adminApi.getDashboardStats(),
    });
};

export const useAdminDoctors = (params?: AdminDoctorsQueryParams) => {
    return useQuery({
        queryKey: ['admin', 'doctors', params],
        queryFn: () => adminApi.getDoctors(params),
    });
};

export const useAdminDoctor = (doctorId: string) => {
    return useQuery({
        queryKey: ['admin', 'doctor', doctorId],
        queryFn: () => adminApi.getDoctorById(doctorId),
        enabled: !!doctorId,
    });
};

export const useUpdateDoctorStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doctorId, status }: { doctorId: string; status: DoctorStatus }) =>
            adminApi.updateDoctorStatus(doctorId, status),
        onSuccess: (doctor) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'doctor', doctor.id] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
            const label = doctor.status === 'verified'
                ? 'Doctor verified and activated.'
                : doctor.status === 'suspended'
                ? 'Doctor account suspended.'
                : 'Doctor status set to pending.';
            toast.success(label);
        },
        onError: () => {
            toast.error('Failed to update status. Please try again.');
        },
    });
};

// ── Patients ──────────────────────────────────────────────────────────────────

export const useAdminPatients = (params?: AdminPatientsQueryParams) => {
    return useQuery({
        queryKey: ['admin', 'patients', params],
        queryFn: () => adminApi.getPatients(params),
    });
};

export const useAdminPatient = (patientId: string) => {
    return useQuery({
        queryKey: ['admin', 'patient', patientId],
        queryFn: () => adminApi.getPatientById(patientId),
        enabled: !!patientId,
    });
};

export const useDeactivateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => adminApi.deactivateUser(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'patient'] });
            queryClient.setQueryData(['admin', 'patient', userId], (old: any) =>
                old ? { ...old, user: { ...old.user, isActive: false } } : old
            );
            toast.success('User account deactivated.');
        },
        onError: () => {
            toast.error('Failed to deactivate user.');
        },
    });
};

export const useActivateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => adminApi.activateUser(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'patient'] });
            queryClient.setQueryData(['admin', 'patient', userId], (old: any) =>
                old ? { ...old, user: { ...old.user, isActive: true } } : old
            );
            toast.success('User account activated.');
        },
        onError: () => {
            toast.error('Failed to activate user.');
        },
    });
};

export const useSendPasswordReset = () => {
    return useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email),
        onSuccess: () => {
            toast.success('Password reset email sent successfully.');
        },
        onError: () => {
            toast.error('Failed to send password reset email.');
        },
    });
};

// ── Appointments ──────────────────────────────────────────────────────────────

export const useAdminAppointments = (params?: AdminAppointmentsQueryParams) => {
    return useQuery({
        queryKey: ['admin', 'appointments', params],
        queryFn: () => adminApi.getAppointments(params),
    });
};

export const useAdminAppointment = (appointmentId: string) => {
    return useQuery({
        queryKey: ['admin', 'appointment', appointmentId],
        queryFn: () => adminApi.getAppointmentById(appointmentId),
        enabled: !!appointmentId,
    });
};

// ── Specialties ───────────────────────────────────────────────────────────────

export const useAdminSpecialties = () => {
    return useQuery({
        queryKey: ['admin', 'specialties'],
        queryFn: () => adminApi.getSpecialties(),
    });
};

export const useCreateSpecialty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (name: string) => adminApi.createSpecialty(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'specialties'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
            toast.success('Specialty created.');
        },
        onError: () => {
            toast.error('Failed to create specialty.');
        },
    });
};

export const useDeleteSpecialty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminApi.deleteSpecialty(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'specialties'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
            toast.success('Specialty removed.');
        },
        onError: () => {
            toast.error('Failed to delete specialty.');
        },
    });
};
