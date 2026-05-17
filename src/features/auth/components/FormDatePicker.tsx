import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";

interface FormDatePickerProps {
    label?: string;
    selected: Date | null;
    onChange: (date: Date | null) => void;
    error?: string;
    helperText?: string;
    minDate?: Date;
    maxDate?: Date;
    placeholderText?: string;
    id?: string;
    disabled?: boolean;
    filterDate?: (date: Date) => boolean;
}

function FormDatePicker({
    label,
    selected,
    onChange,
    error,
    helperText,
    minDate,
    maxDate,
    placeholderText = "Select a date",
    id,
    disabled,
    filterDate,
}: FormDatePickerProps) {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block font-poppins text-sm font-semibold text-neutral-600 mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 z-10 pointer-events-none" />
                <DatePicker
                    id={id}
                    selected={selected}
                    onChange={onChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText={placeholderText}
                    disabled={disabled}
                    filterDate={filterDate}
                    dateFormat="MMM dd, yyyy"
                    showPopperArrow={false}
                    className={`w-full pl-10 pr-4 py-3 border ${error ? "border-red-500" : "border-neutral-300"
                        } rounded-lg font-poppins text-sm text-neutral-900 placeholder-neutral-400 bg-white focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-primary-500"
                        } focus:border-transparent transition-all disabled:bg-neutral-50 disabled:cursor-not-allowed`}
                    wrapperClassName="w-full"
                    popperClassName="z-50"
                    calendarClassName="!font-poppins !border !border-neutral-200 !rounded-xl !shadow-lg"
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 font-poppins">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-xs text-neutral-500 font-poppins">{helperText}</p>
            )}
        </div>
    );
}

export default FormDatePicker;
