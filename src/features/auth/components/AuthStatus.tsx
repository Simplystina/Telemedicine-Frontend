import type { ReactNode } from 'react';
import { FiAlertCircle, FiAlertTriangle, FiCheck, FiLoader, FiX } from 'react-icons/fi';

type Tone = 'success' | 'error' | 'warning' | 'loading';

const tones: Record<Tone, { wrap: string; icon: ReactNode }> = {
    success: { wrap: 'bg-green-50 text-green-600 ring-green-100', icon: <FiCheck className="h-7 w-7" /> },
    error: { wrap: 'bg-red-50 text-red-600 ring-red-100', icon: <FiX className="h-7 w-7" /> },
    warning: { wrap: 'bg-amber-50 text-amber-600 ring-amber-100', icon: <FiAlertTriangle className="h-7 w-7" /> },
    loading: { wrap: 'bg-primary-50 text-primary-600 ring-primary-100', icon: <FiLoader className="h-7 w-7 animate-spin" /> },
};

/** Round icon badge for result screens (verified, failed, link sent...). */
export function AuthStatusIcon({ tone }: { tone: Tone }) {
    const { wrap, icon } = tones[tone];
    return (
        <div className={`m-2 grid h-16 w-16 place-items-center rounded-full ring-8 ${wrap}`} aria-hidden="true">
            {icon}
        </div>
    );
}

/** Inline error message box for form-level errors. */
export function AuthAlert({ children }: { children: ReactNode }) {
    return (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
            <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <p className="font-poppins text-sm font-medium text-red-700">{children}</p>
        </div>
    );
}
