import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthButton from '../components/AuthButton';
import FormInput from '../components/FormInput';

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
        <AuthLayout>
            <AuthHeader title="Get a new link" subtitle="Enter your email and we'll send you a new verification link." />

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    icon={<FiMail className="h-5 w-5" />}
                    required
                />

                <AuthButton isLoading={isResending} loadingText="Sending link...">
                    Send verification link
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

            <p className="text-center font-poppins text-sm text-neutral-500">
                Questions?{' '}
                <a href="mailto:support@likita24.com" className="font-semibold text-neutral-900 hover:text-primary-600">
                    Contact our support team
                </a>
            </p>
        </AuthLayout>
    );
}

export default ResendVerificationPage;
