import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    /** Optional icon shown inside the field, on the left. */
    icon?: ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, icon, className = '', ...props }, ref) => {
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
                        aria-invalid={error ? true : undefined}
                        className={`w-full h-12 ${icon ? 'pl-11 pr-4' : 'px-4'} bg-white border ${error ? 'border-red-500' : 'border-neutral-200 hover:border-neutral-300'
                            } rounded-xl font-inter text-base text-neutral-900 placeholder-neutral-400 shadow-xs focus:outline-none focus:ring-4 ${error ? 'focus:ring-red-500/15' : 'focus:border-primary-500 focus:ring-primary-500/15'
                            } transition-all ${className}`}
                        {...props}
                    />
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

FormInput.displayName = 'FormInput';

export default FormInput;
