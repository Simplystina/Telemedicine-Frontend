import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import NotFoundPage from '@shared/components/NotFoundPage';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    redirectTo?: string;
    /**
     * Show the 404 page instead of redirecting when access is denied, so the
     * existence of these pages (e.g. admin) isn't revealed to visitors.
     */
    hideWhenDenied?: boolean;
}

export default function ProtectedRoute({ allowedRoles, redirectTo = '/auth/login', hideWhenDenied = false }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return hideWhenDenied ? <NotFoundPage /> : <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return hideWhenDenied ? <NotFoundPage /> : <Navigate to={`/${user.role}`} replace />;
    }

    return <Outlet />;
}
