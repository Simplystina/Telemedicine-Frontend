import { Outlet } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import { useMyDoctorProfile } from '@/features/doctor/hooks/useDoctors';

function DoctorVerifiedRoute() {
    const { data: profile, isLoading } = useMyDoctorProfile();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (profile?.status !== 'verified') {
        const isSuspended = profile?.status === 'suspended';
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8 animate-fade-in-up">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isSuspended ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <FiShield className={`w-8 h-8 ${isSuspended ? 'text-red-600' : 'text-amber-600'}`} />
                </div>
                <h2 className="text-lg font-bold font-archivo text-neutral-900 mb-2">
                    {isSuspended ? 'Access Suspended' : 'Awaiting Approval'}
                </h2>
                <p className="text-sm font-poppins text-neutral-500 max-w-sm">
                    {isSuspended
                        ? 'Your account has been suspended. Please contact support for assistance.'
                        : 'This section will become available once an admin approves your account.'}
                </p>
            </div>
        );
    }

    return <Outlet />;
}

export default DoctorVerifiedRoute;
