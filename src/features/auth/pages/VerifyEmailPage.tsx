import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import { AuthAlert, AuthStatusIcon } from '../components/AuthStatus';
import { authPrimaryButton, authSecondaryButton } from '../components/authStyles';

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { verifyEmail, isVerifying, verifyError, verifySuccess } = useAuth();
    const [hasAttempted, setHasAttempted] = useState(false);

    useEffect(() => {
        const performVerification = async () => {
            if (token && !hasAttempted) {
                setHasAttempted(true);
                try {
                    await verifyEmail(token);
                    toast.success('Email verified successfully!');
                } catch (err: any) {
                    console.error('Email verification error:', err);
                    toast.error(err.response?.data?.message || err.message || 'Verification failed');
                }
            }
        };
        performVerification();
    }, [token, verifyEmail, hasAttempted]);

    return (
        <AuthLayout>
            {isVerifying ? (
                <div role="status" className="space-y-6">
                    <AuthStatusIcon tone="loading" />
                    <div>
                        <AuthHeader title="Verifying your email" subtitle="Please wait while we confirm your email address..." />
                    </div>
                </div>
            ) : verifySuccess ? (
                <div className="space-y-6">
                    <AuthStatusIcon tone="success" />
                    <div>
                        <AuthHeader
                            title="Email verified"
                            subtitle="Your email has been verified. You now have full access to your account and medical records."
                        />
                    </div>
                    <Link to="/auth/login" className={authPrimaryButton}>
                        Sign in to your account
                        <FiArrowRight aria-hidden="true" />
                    </Link>
                </div>
            ) : verifyError ? (
                <div className="space-y-6">
                    <AuthStatusIcon tone="error" />
                    <div>
                        <AuthHeader title="Verification failed" />
                    </div>
                    <div>
                        <AuthAlert>
                            {verifyError.response?.data?.message || verifyError.message || 'The verification link is invalid or has expired.'}
                        </AuthAlert>
                    </div>
                    <div className="space-y-3">
                        <Link to="/auth/resend-verification" className={authPrimaryButton}>
                            Get a new link
                        </Link>
                        <Link to="/auth/login" className={authSecondaryButton}>
                            Back to sign in
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <AuthStatusIcon tone="warning" />
                    <div>
                        <AuthHeader
                            title={token ? 'Complete verification' : 'Invalid link'}
                            subtitle={
                                token
                                    ? 'Hold on while we complete your account setup and verify your identity.'
                                    : 'The link you followed is missing a verification token. Please check your email and try again.'
                            }
                        />
                    </div>
                    <Link to="/auth/login" className={authPrimaryButton}>
                        Return to sign in
                    </Link>
                </div>
            )}

            <p className="text-center font-poppins text-sm text-neutral-500">
                Questions?{' '}
                <a href="mailto:support@likita24.com" className="font-semibold text-neutral-900 hover:text-primary-600">
                    Contact our support team
                </a>
            </p>
        </AuthLayout>
    );
}

export default VerifyEmailPage;
