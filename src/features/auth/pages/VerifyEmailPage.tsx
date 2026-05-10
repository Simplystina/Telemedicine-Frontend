import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Logo from '@assets/logo.png';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

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
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-primary-50 via-white to-primary-100 p-4">
            <div className="max-w-md w-full animate-fade-in-up">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-6">
                        {Logo && <img src={Logo} alt="Logo" className="w-16 h-16 drop-shadow-sm" />}
                        <h1 className="font-archivo text-2xl font-bold text-neutral-900 ml-3">
                            Dr. Abdumalik
                        </h1>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-primary-500/10 p-8 text-center border border-white/20 backdrop-blur-sm">
                    {isVerifying ? (
                        <div className="py-10">
                            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary-500 mx-auto mb-6"></div>
                            <h3 className="font-archivo text-xl font-bold text-neutral-900 mb-2">Verifying Address</h3>
                            <p className="font-poppins text-neutral-600">Please wait while we confirm your email...</p>
                        </div>
                    ) : verifySuccess ? (
                        <div className="py-6">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-short">
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-archivo text-2xl font-bold text-neutral-900 mb-3">
                                Verification Successful!
                            </h3>
                            <p className="font-poppins text-neutral-600 mb-8 leading-relaxed">
                                Your email has been verified. You now have full access to your account and medical records.
                            </p>
                            <Link
                                to="/auth/login"
                                className="inline-flex items-center justify-center w-full bg-primary-500 hover:bg-primary-600 text-white font-poppins text-base font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-primary-500/25 active:scale-95 group"
                            >
                                <span>Sign In to Your Account</span>
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    ) : verifyError ? (
                        <div className="py-6">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="font-archivo text-2xl font-bold text-neutral-900 mb-3">
                                Verification Failed
                            </h3>
                            <div className="mb-8 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                                <p className="font-poppins text-sm text-red-600 font-medium leading-relaxed">
                                    {verifyError.response?.data?.message || verifyError.message || 'The verification link is invalid or has expired.'}
                                </p>
                            </div>
                            <Link
                                to="/auth/resend-verification"
                                className="inline-block w-full bg-neutral-900 hover:bg-neutral-800 text-white font-poppins text-base font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg active:scale-95 mb-4"
                            >
                                Get a New Link
                            </Link>
                            <Link
                                to="/auth/login"
                                className="block font-poppins text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <div className="py-6">
                            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-archivo text-2xl font-bold text-neutral-900 mb-3">
                                {token ? 'Complete Verification' : 'Invalid Link'}
                            </h3>
                            <p className="font-poppins text-neutral-600 mb-8 leading-relaxed">
                                {token
                                    ? 'Click the button below to complete your account setup and verify your identity.'
                                    : 'The link you followed is missing a verification token. Please check your email and try again.'}
                            </p>
                            <Link
                                to="/auth/login"
                                className="inline-block w-full bg-primary-500 hover:bg-primary-600 text-white font-poppins text-base font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-primary-500/25 active:scale-95"
                            >
                                Return to Sign In
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <p className="mt-8 text-center font-poppins text-sm text-neutral-500">
                    Questions? <Link to="/support" className="text-primary-600 font-semibold hover:underline">Contact our support team</Link>
                </p>
            </div>
        </div>
    );
}

export default VerifyEmailPage;
