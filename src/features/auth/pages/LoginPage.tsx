import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../validation/schemas';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import { FaUser, FaUserMd } from "react-icons/fa";
import { FiLogIn, FiArrowRight, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthButton from '../components/AuthButton';
import { AuthAlert } from '../components/AuthStatus';
import { authSecondaryButton } from '../components/authStyles';

function LoginPage() {
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');
    const { login, isLoggingIn, loginError, logout } = useAuth();
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login({ email: data.email, password: data.password });
        } catch (error: any) {
            const message: string = error?.response?.data?.message || error?.message || '';
            if (message.toLowerCase().includes('verif')) {
                navigate('/auth/resend-verification', { state: { email: data.email } });
            }
        }
    };

    const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email : null;
    const dashboardPath = user ? `/${user.role}` : null;

    const roleButton = (value: 'patient' | 'doctor', label: string, icon: React.ReactNode) => (
        <button
            type="button"
            onClick={() => setRole(value)}
            aria-pressed={role === value}
            className={`flex-1 flex items-center justify-center gap-2 min-h-11 rounded-lg font-poppins text-sm font-semibold transition-all ${role === value
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <AuthLayout>
            {user && (
                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <p className="font-poppins text-sm font-semibold text-primary-900">
                            Already signed in as {fullName}
                        </p>
                        <p className="font-poppins text-xs text-primary-600 mt-0.5 capitalize">
                            {user.role} account
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => { logout(); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary-200 text-xs font-semibold font-poppins text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                            <FiLogIn className="w-3.5 h-3.5" />
                            Switch account
                        </button>
                        <button
                            onClick={() => navigate(dashboardPath!)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-500 text-white text-xs font-semibold font-poppins hover:bg-primary-600 transition-colors"
                        >
                            Go to dashboard
                            <FiArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            <AuthHeader title="Welcome back" subtitle="Sign in to access your appointments, messages and records." />

            {loginError && (
                <div>
                    <AuthAlert>
                        {loginError.response?.data?.message || loginError.message || 'Login failed. Please check your credentials.'}
                    </AuthAlert>
                </div>
            )}

            {/* Role Selector */}
            <div className="flex p-1 bg-neutral-200 rounded-xl" role="group" aria-label="Account type">
                {roleButton('patient', 'Patient', <FaUser className="w-3.5 h-3.5" />)}
                {roleButton('doctor', 'Doctor', <FaUserMd className="w-4 h-4" />)}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormInput
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    icon={<FiMail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <PasswordInput
                    label="Password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    icon={<FiLock className="h-5 w-5" />}
                    error={errors.password?.message}
                    {...register('password')}
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('rememberMe')}
                            className="w-4 h-4 rounded accent-primary-500"
                        />
                        <span className="ml-2 font-poppins text-sm text-neutral-700">Remember me</span>
                    </label>
                    <Link
                        to="/auth/forgot-password"
                        className="py-3 -my-3 font-poppins text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <AuthButton isLoading={isLoggingIn} loadingText="Signing in...">
                    Sign in
                </AuthButton>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4" role="separator">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="font-poppins text-sm text-neutral-500">or</span>
                <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* Social Login */}
            <button type="button" className={authSecondaryButton}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </button>

            <p className="text-center font-poppins text-sm text-neutral-500">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
}

export default LoginPage;
