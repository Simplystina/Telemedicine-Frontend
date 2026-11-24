import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiLock } from 'react-icons/fi';
import { resetPasswordSchema, type ResetPasswordFormData } from '../validation/schemas';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthButton from '../components/AuthButton';
import { AuthAlert, AuthStatusIcon } from '../components/AuthStatus';
import { authPrimaryButton } from '../components/authStyles';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { resetPassword, isResettingPassword, resetPasswordError } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    // Password strength indicators
    const requirements = [
        { label: 'At least 8 characters', met: password?.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password || '') },
        { label: 'One number', met: /[0-9]/.test(password || '') },
    ];

    if (!token) {
        return <Navigate to="/auth/forgot-password" replace />;
    }

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            await resetPassword({ token, password: data.password });
            setIsSubmitted(true);
        } catch {
            // Error displayed via resetPasswordError banner
        }
    };

    return (
        <AuthLayout>
            {!isSubmitted ? (
                <>
                    <AuthHeader title="Reset password" subtitle="Choose a new password for your account." />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        {resetPasswordError && (
                            <AuthAlert>
                                {resetPasswordError.response?.data?.message || resetPasswordError.message || 'Something went wrong. Please try again.'}
                            </AuthAlert>
                        )}

                        <PasswordInput
                            label="New password"
                            id="password"
                            autoComplete="new-password"
                            placeholder="Enter new password"
                            icon={<FiLock className="h-5 w-5" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <PasswordInput
                            label="Confirm new password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            placeholder="Confirm new password"
                            icon={<FiLock className="h-5 w-5" />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        {/* Password requirements */}
                        <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-4">
                            <p className="mb-2 font-poppins text-xs font-semibold text-neutral-900">Password must contain:</p>
                            <ul className="space-y-1.5">
                                {requirements.map(({ label, met }) => (
                                    <li key={label} className={`flex items-center gap-2 font-poppins text-xs ${met ? 'text-green-600' : 'text-neutral-500'}`}>
                                        <FiCheck className={`h-4 w-4 ${met ? 'text-green-600' : 'text-neutral-400'}`} aria-hidden="true" />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <AuthButton isLoading={isResettingPassword} loadingText="Resetting password...">
                            Reset password
                        </AuthButton>
                    </form>

                    <div className="text-center">
                        <Link
                            to="/auth/login"
                            className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            <FiArrowLeft aria-hidden="true" />
                            Back to sign in
                        </Link>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <AuthStatusIcon tone="success" />
                    <div>
                        <AuthHeader
                            title="Password reset"
                            subtitle="Your password has been reset successfully. You can now sign in with your new password."
                        />
                    </div>
                    <Link to="/auth/login" className={authPrimaryButton}>
                        Go to sign in
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
}

export default ResetPasswordPage;
