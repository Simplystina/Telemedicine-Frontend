import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiUserPlus } from 'react-icons/fi';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../validation/schemas';
import FormInput from '../components/FormInput';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthButton from '../components/AuthButton';
import { AuthAlert, AuthStatusIcon } from '../components/AuthStatus';

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

    const noAccountFound = forgotPasswordError?.response?.data?.message?.toLowerCase().includes('no account found');

    return (
        <AuthLayout>
            {!isSubmitted ? (
                <>
                    <AuthHeader
                        title="Forgot password?"
                        subtitle="No worries. Enter your email and we'll send you reset instructions."
                    />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        {forgotPasswordError && (
                            <AuthAlert>
                                {forgotPasswordError.response?.data?.message || forgotPasswordError.message || 'Something went wrong. Please try again.'}
                            </AuthAlert>
                        )}

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

                        <AuthButton isLoading={isSendingReset} loadingText="Sending...">
                            Send reset link
                        </AuthButton>
                    </form>
                </>
            ) : (
                <div className="space-y-6">
                    <AuthStatusIcon tone="success" />
                    <div>
                        <AuthHeader
                            title="Check your email"
                            subtitle={
                                <>
                                    We've sent password reset instructions to{' '}
                                    <span className="font-semibold text-neutral-900">{submittedEmail}</span>
                                </>
                            }
                        />
                    </div>
                    <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 font-poppins text-sm text-neutral-700">
                        <span className="font-semibold">Didn't receive the email?</span> Check your spam folder or{' '}
                        <button onClick={handleTryAgain} className="font-semibold text-primary-600 underline hover:text-primary-700">
                            try again
                        </button>
                        .
                    </div>
                </div>
            )}

            <div className="text-center">
                {noAccountFound ? (
                    <Link
                        to="/auth/signup"
                        className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        <FiUserPlus aria-hidden="true" />
                        Create an account
                    </Link>
                ) : (
                    <Link
                        to="/auth/login"
                        className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <FiArrowLeft aria-hidden="true" />
                        Back to sign in
                    </Link>
                )}
            </div>
        </AuthLayout>
    );
}

export default ForgotPasswordPage;
