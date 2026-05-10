import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { useSpecialties } from "@/features/doctor/hooks/useDoctors";

interface SpecialtySelectProps {
    value?: number;
    onChange: (id: number | undefined) => void;
    error?: string;
    disabled?: boolean;
    label?: string;
}

function SpecialtySelect({ value, onChange, error, disabled, label = 'Specialty' }: SpecialtySelectProps) {
    const { data: specialties = [], isLoading } = useSpecialties();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = specialties.find(s => s.id === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div>
            {label && (
                <label className="block font-poppins text-sm font-semibold text-neutral-900 mb-1.5">
                    {label} <span className="text-red-500">*</span>
                </label>
            )}
            <div ref={ref} className="relative">
                <button
                    type="button"
                    disabled={disabled || isLoading}
                    onClick={() => !disabled && !isLoading && setOpen(v => !v)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl font-poppins text-sm text-left transition-all outline-none ${
                        error
                            ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                            : open
                                ? 'border-primary-500 ring-2 ring-primary-500/20'
                                : 'border-neutral-200 hover:border-neutral-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <span className={selected ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                        {isLoading ? 'Loading specialties…' : selected?.name ?? 'Select a specialty'}
                    </span>
                    <FiChevronDown
                        className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                {open && !isLoading && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                        <div className="max-h-56 overflow-y-auto custom-scrollbar py-1">
                            <button
                                type="button"
                                onClick={() => { onChange(undefined); setOpen(false); }}
                                className="w-full text-left px-4 py-2.5 text-sm font-poppins text-neutral-400 hover:bg-neutral-50 transition-colors"
                            >
                                Select a specialty
                            </button>
                            <div className="border-t border-neutral-100 my-1" />
                            {specialties.map(s => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => { onChange(s.id); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-poppins transition-colors flex items-center justify-between gap-2 ${
                                        value === s.id
                                            ? 'bg-primary-50 text-primary-700 font-semibold'
                                            : 'text-neutral-700 hover:bg-neutral-50'
                                    }`}
                                >
                                    <span>{s.name}</span>
                                    {value === s.id && <FiCheck className="w-4 h-4 text-primary-500 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 font-poppins text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default SpecialtySelect;
