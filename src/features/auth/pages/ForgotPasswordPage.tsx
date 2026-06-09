import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import Logo from '@assets/logo.png';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../validation/schemas';
import FormInput from '../components/FormInput';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';

function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const { forgotPassword, isSendingReset, forgotPasswordError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPassword(data.email);
            setSubmittedEmail(data.email);
            setIsSubmitted(true);
        } catch {
            // Error displayed via forgotPasswordError banner
        }
    };

    const handleTryAgain = () => {
        setIsSubmitted(false);
        setSubmittedEmail('');
        reset();
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
                    Forgot Password?
                </h2>
                <p className="font-inter text-base text-neutral-600">
                    {isSubmitted
                        ? "Check your email for reset instructions"
                        : "No worries, we'll send you reset instructions"
                    }
                </p>
            </div>

            {/* Forgot Password Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {forgotPasswordError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="font-poppins text-sm text-red-600 font-medium">
                                    {forgotPasswordError.response?.data?.message || forgotPasswordError.message || 'Something went wrong. Please try again.'}
                                </p>
                            </div>
                        )}

                        {/* Email Input */}
                        <FormInput
                            label="Email Address"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSendingReset}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-inter text-base font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:active:scale-100"
                        >
                            {isSendingReset ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                'Send Reset Link'
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
                            Email Sent!
                        </h3>
                        <p className="font-inter text-sm text-neutral-600 mb-6">
                            We've sent password reset instructions to<br />
                            <span className="font-semibold text-neutral-900">{submittedEmail}</span>
                        </p>

                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                            <p className="font-inter text-sm text-neutral-700">
                                <span className="font-semibold">Didn't receive the email?</span><br />
                                Check your spam folder or{' '}
                                <button
                                    onClick={handleTryAgain}
                                    className="text-primary-500 hover:text-primary-600 font-semibold underline"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                    </div>
                )}

                {/* Back to Login / Sign Up */}
                <div className="mt-6">
                    {forgotPasswordError?.response?.data?.message?.toLowerCase().includes('no account found') ? (
                        <Link
                            to="/auth/register"
                            className="flex items-center justify-center font-inter text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Create an Account
                        </Link>
                    ) : (
                        <Link
                            to="/auth/login"
                            className="flex items-center justify-center font-inter text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Sign In
                        </Link>
                    )}
                </div>
            </div>
        </AuthLayout>
    );
}

export default ForgotPasswordPage;
