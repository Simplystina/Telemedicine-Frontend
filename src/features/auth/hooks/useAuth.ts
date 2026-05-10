import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginCredentials, PatientRegisterPayload, DoctorRegisterPayload, AuthUser } from "@/types";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setUser, setRefreshToken, logout: clearStore } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (data) => {
            if (data.user.role === 'admin') {
                toast.error('Admin accounts must sign in via the Admin Portal.');
                navigate('/admin-login');
                return;
            }
            setUser({ ...data.user, token: data.accessToken } as AuthUser);
            setRefreshToken(data.refreshToken);
            toast.success('Signed in successfully!');
            if (data.user.role === 'doctor') {
                navigate('/doctor');
            } else {
                navigate('/patient');
            }
        }
    });

    const registerPatientMutation = useMutation({
        mutationFn: (payload: PatientRegisterPayload) => authApi.registerPatient(payload),
        onSuccess: () => {
            toast.success('Account created! Please check your email to verify your account.');
            navigate('/auth/login');
        }
    });

    const registerDoctorMutation = useMutation({
        mutationFn: (payload: DoctorRegisterPayload) => authApi.registerDoctor(payload),
        onSuccess: () => {
            toast.success('Registration successful! Please check your email to verify your account.');
            navigate('/auth/login');
        }
    });
    
    const forgotPasswordMutation = useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email),
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (payload: { token: string; password: string }) => authApi.resetPassword(payload),
        onSuccess: () => {
            toast.success('Password reset successfully!');
        },
    });

    const verifyEmailMutation = useMutation({
        mutationFn: (token: string) => authApi.verifyEmail(token),
    });

    const resendVerificationMutation = useMutation({
        mutationFn: (email: string) => authApi.resendVerification(email),
    });

    const logout = (redirectTo = '/auth/login') => {
        clearStore();
        queryClient.clear();
        navigate(redirectTo);
    };

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error as any,
        
        registerPatient: registerPatientMutation.mutateAsync,
        isRegisteringPatient: registerPatientMutation.isPending,
        registerPatientError: registerPatientMutation.error as any,

        registerDoctor: registerDoctorMutation.mutateAsync,
        isRegisteringDoctor: registerDoctorMutation.isPending,
        registerDoctorError: registerDoctorMutation.error as any,

        forgotPassword: forgotPasswordMutation.mutateAsync,
        isSendingReset: forgotPasswordMutation.isPending,
        forgotPasswordError: forgotPasswordMutation.error as any,

        resetPassword: resetPasswordMutation.mutateAsync,
        isResettingPassword: resetPasswordMutation.isPending,
        resetPasswordError: resetPasswordMutation.error as any,

        verifyEmail: verifyEmailMutation.mutateAsync,
        isVerifying: verifyEmailMutation.isPending,
        verifyError: verifyEmailMutation.error as any,
        verifySuccess: verifyEmailMutation.isSuccess,

        resendVerification: resendVerificationMutation.mutateAsync,
        isResending: resendVerificationMutation.isPending,
        resendSuccess: resendVerificationMutation.isSuccess,

        logout
    };
};
