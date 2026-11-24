import type { ButtonHTMLAttributes } from 'react';
import { FiLoader } from 'react-icons/fi';
import { authPrimaryButton } from './authStyles';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
}

/** Primary call-to-action button for auth forms, with a built-in loading state. */
function AuthButton({ isLoading = false, loadingText, children, className = '', disabled, ...props }: AuthButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled || isLoading}
            className={`${authPrimaryButton} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
}

export default AuthButton;
