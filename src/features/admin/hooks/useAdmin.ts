import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { adminApi } from "../api/adminApi";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import type { LoginCredentials, AdminDoctorsQueryParams, DoctorStatus, AuthUser } from "@/types";

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
