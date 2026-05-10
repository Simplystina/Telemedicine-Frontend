import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    redirectTo?: string;
}

export default function ProtectedRoute({ allowedRoles, redirectTo = '/auth/login' }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={`/${user.role}`} replace />;
    }

    return <Outlet />;
}
