import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    error?: string;
    helperText?: string;
    /** Optional icon shown inside the field, on the left. */
    icon?: ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, helperText, icon, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="w-full">
                <label
                    htmlFor={props.id}
                    className="block font-poppins text-sm font-medium text-neutral-700 mb-1.5"
                >
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        aria-invalid={error ? true : undefined}
                        className={`w-full h-12 ${icon ? 'pl-11' : 'pl-4'} pr-12 bg-white border ${error ? 'border-red-500' : 'border-neutral-200 hover:border-neutral-300'
                            } rounded-xl font-inter text-base text-neutral-900 placeholder-neutral-400 shadow-xs focus:outline-none focus:ring-4 ${error ? 'focus:ring-red-500/15' : 'focus:border-primary-500 focus:ring-primary-500/15'
                            } transition-all ${className}`}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-3 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        tabIndex={-1}
                    >
                        {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-600 font-inter">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-xs text-neutral-500 font-inter">{helperText}</p>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
