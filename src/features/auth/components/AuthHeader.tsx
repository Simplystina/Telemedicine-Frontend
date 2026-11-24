import type { ReactNode } from 'react';

interface AuthHeaderProps {
    title: string;
    subtitle?: ReactNode;
}

/** Page title block used at the top of every auth screen. Outer spacing comes from AuthLayout. */
function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div>
            <h1 className="font-archivo text-3xl font-bold tracking-tight text-neutral-900">{title}</h1>
            {subtitle && <p className="mt-2 font-poppins text-sm leading-relaxed text-neutral-500">{subtitle}</p>}
        </div>
    );
}

export default AuthHeader;
