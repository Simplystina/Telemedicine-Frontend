import { type SelectHTMLAttributes, forwardRef } from 'react';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    helperText?: string;
    options: { label: string; value: string }[];
    placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, error, helperText, className = '', options, placeholder, ...props }, ref) => {
        return (
            <div className="w-full">
                <label
                    htmlFor={props.id}
                    className="block font-poppins text-sm font-semibold text-neutral-600 mb-2"
                >
                    {label}
                </label>
                <select
                    ref={ref}
                    className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-neutral-300'
                        } rounded-lg font-poppins text-base text-neutral-900 bg-white focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'
                        } focus:border-transparent transition-all ${className}`}
                    {...props}
                >
                    {placeholder && (
                        <option value="">{placeholder}</option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600 font-poppins">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-xs text-neutral-500 font-poppins">{helperText}</p>
                )}
            </div>
        );
    }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
