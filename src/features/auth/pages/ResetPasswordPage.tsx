import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import Logo from '@assets/Logo.png';
import { resetPasswordSchema, type ResetPasswordFormData } from '../validation/schemas';
import PasswordInput from '../components/PasswordInput';

import AuthLayout from '../components/AuthLayout';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    // Password strength indicators
    const hasMinLength = password?.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password || '');
    const hasNumber = /[0-9]/.test(password || '');

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Reset password with token:', token, data);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Reset password error:', error);
        }
    };

    return (
        <AuthLayout>
            {/* Logo and Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center items-center mb-6">
                    <img src={Logo} alt="Dr. Abdumalik Telemedicine" className="w-16 h-16" />
                    <h1 className="font-archivo text-2xl font-bold text-neutral-900 ml-3">
                        Dr. Abdumalik
                    </h1>
                </div>
                <h2 className="font-archivo text-3xl font-bold text-neutral-900 mb-2">
                    Reset Password
                </h2>
                <p className="font-inter text-base text-neutral-600">
                    {isSubmitted
                        ? "Your password has been reset successfully"
                        : "Enter your new password below"
                    }
                </p>
            </div>

            {/* Reset Password Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* New Password Input */}
                        <PasswordInput
                            label="New Password"
                            id="password"
                            placeholder="Enter new password"
                            error={errors.password?.message}
                            helperText="Must be at least 8 characters"
                            {...register('password')}
                        />

                        {/* Confirm Password Input */}
                        <PasswordInput
                            label="Confirm New Password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        {/* Password Requirements */}
                        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                            <p className="font-inter text-xs font-semibold text-neutral-900 mb-2">
                                Password must contain:
                            </p>
                            <ul className="space-y-1">
                                <li className={`flex items-center font-inter text-xs ${hasMinLength ? 'text-green-600' : 'text-neutral-600'}`}>
                                    <svg className={`w-4 h-4 mr-2 ${hasMinLength ? 'text-green-600' : 'text-neutral-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    At least 8 characters
                                </li>
                                <li className={`flex items-center font-inter text-xs ${hasUpperCase ? 'text-green-600' : 'text-neutral-600'}`}>
                                    <svg className={`w-4 h-4 mr-2 ${hasUpperCase ? 'text-green-600' : 'text-neutral-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    One uppercase letter
                                </li>
                                <li className={`flex items-center font-inter text-xs ${hasNumber ? 'text-green-600' : 'text-neutral-600'}`}>
                                    <svg className={`w-4 h-4 mr-2 ${hasNumber ? 'text-green-600' : 'text-neutral-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    One number
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-inter text-base font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:active:scale-100"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting password...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h3 className="font-archivo text-xl font-bold text-neutral-900 mb-2">
                            Password Reset Successful!
                        </h3>
                        <p className="font-inter text-sm text-neutral-600 mb-6">
                            Your password has been reset successfully.<br />
                            You can now sign in with your new password.
                        </p>

                        <Link
                                to="/auth/login"
                            className="inline-block w-full bg-primary-500 hover:bg-primary-600 text-white font-inter text-base font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Go to Sign In
                        </Link>
                    </div>
                )}

                {/* Back to Login (only show if not submitted) */}
                {!isSubmitted && (
                    <div className="mt-6">
                        <Link
                                to="/auth/login"
                            className="flex items-center justify-center font-inter text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Sign In
                        </Link>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}

export default ResetPasswordPage;
