import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@assets/logo.png';
import AuthShowcase from './AuthShowcase';

interface AuthLayoutProps {
    children: ReactNode;
}

/**
 * Shared shell for every auth screen.
 * - lg and up: two equal columns. Left = brand panel (photo fills it, 16px inset on all sides);
 *   right = form centred in its half.
 * - below lg: brand panel is not rendered visually; one centred form column with a compact logo on top.
 */
function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="grid min-h-dvh w-full grid-cols-1 bg-white lg:grid-cols-2">
            <AuthShowcase />

            <main className="flex items-center justify-center px-5 py-8 lg:px-12 lg:py-10">
                <div className="w-full max-w-md space-y-6 animate-fade-in-up">
                    {/* Brand for small screens (the brand panel is hidden there) */}
                    <Link to="/" className="flex w-fit items-center gap-2.5 lg:hidden" aria-label="Likita24 home">
                        <img src={Logo} alt="" className="h-9 w-9" />
                        <span className="font-archivo text-lg font-bold tracking-tight text-neutral-900">Likita24</span>
                    </Link>

                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;
