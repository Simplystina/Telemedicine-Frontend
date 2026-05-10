import { api } from "@/services/axios";
import type { LoginCredentials, PatientRegisterPayload, DoctorRegisterPayload, User, AuthResponse, RegistrationResponse, ResendVerificationResponse, ForgotPasswordResponse, ResetPasswordData, ResetPasswordResponse } from "@/types";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    registerPatient: async (payload: PatientRegisterPayload): Promise<RegistrationResponse> => {
        const { data } = await api.post<RegistrationResponse>('/auth/register-patient', payload);
        return data;
    },

    registerDoctor: async (payload: DoctorRegisterPayload): Promise<RegistrationResponse> => {
        const { data } = await api.post<RegistrationResponse>('/auth/register-doctor', payload);
        return data;
    },

    getMe: async (): Promise<User> => {
        const { data } = await api.get<User>('/auth/me');
        return data;
    },

    refresh: async (): Promise<{ token: string }> => {
        const { data } = await api.post<{ token: string }>('/auth/refresh');
        return data;
    },

    verifyEmail: async (token: string): Promise<{ message: string }> => {
        const { data } = await api.get<{ message: string }>(`/auth/verify-email?token=${token}`);
        return data;
    },

    resendVerification: async (email: string): Promise<ResendVerificationResponse> => {
        const { data } = await api.post<ResendVerificationResponse>('/auth/verify-email/resend', { email });
        return data;
    },

    forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
        const { data } = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
        return data;
    },

    resetPassword: async (payload: ResetPasswordData): Promise<ResetPasswordResponse> => {
        const { data } = await api.post<ResetPasswordResponse>('/auth/reset-password', payload);
        return data;
    },

    adminLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/admin/login', credentials);
        return data;
    },
};
