import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@assets/logo.png';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

function ResendVerificationPage() {
    const { resendVerification, isResending } = useAuth();
    const location = useLocation();
    const [email, setEmail] = useState((location.state as { email?: string })?.email ?? '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await resendVerification(email);
            toast.success(response.message || 'Verification link sent!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend link');
        }
    };

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
                    <h2 className="font-poppins text-2xl font-semibold text-neutral-900 mb-2">
                        Get New Link
                    </h2>
                    <p className="font-poppins text-neutral-600">
                        Enter your email to receive a new verification link
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-primary-500/10 p-8 text-center border border-white/20 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-left">
                            <label htmlFor="email" className="block font-poppins text-sm font-semibold text-neutral-900 mb-2 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. john@example.com"
                                required
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-hidden transition-all font-poppins text-neutral-900"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isResending}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-poppins text-base font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-primary-500/25 active:scale-95"
                        >
                            {isResending ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending Link...
                                </span>
                            ) : 'Send Verification Link'}
                        </button>

                        <div className="pt-4 border-t border-neutral-100 mt-6">
                             <Link
                                to="/auth/login"
                                className="font-poppins text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer Section */}
                <p className="mt-8 text-center font-poppins text-sm text-neutral-500">
                    Questions? <Link to="/support" className="text-primary-600 font-semibold hover:underline">Contact our support team</Link>
                </p>
            </div>
        </div>
    );
}

export default ResendVerificationPage;
