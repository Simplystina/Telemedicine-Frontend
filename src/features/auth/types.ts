// Auth feature types
export interface User {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    fullName?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'patient' | 'doctor';
    agreeToTerms: boolean;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    password: string;
    confirmPassword: string;
    token?: string;
}
