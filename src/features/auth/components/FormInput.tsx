import { type InputHTMLAttributes, forwardRef } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label
                    htmlFor={props.id}
                    className="block font-poppins text-sm font-semibold text-neutral-600 mb-2"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-neutral-300'
                        } rounded-lg font-inter text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'
                        } focus:border-transparent transition-all ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600 font-inter">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-xs text-neutral-500 font-inter">{helperText}</p>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
