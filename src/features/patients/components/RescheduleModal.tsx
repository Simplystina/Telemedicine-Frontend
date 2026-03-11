import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiX, FiClock, FiCalendar, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import FormDatePicker from "@/features/auth/components/FormDatePicker";

// ---- Types ----
export interface AppointmentToReschedule {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    imageUrl?: string;
}

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: AppointmentToReschedule | null;
}

// ---- Zod Schema ----
const rescheduleSchema = z.object({
    newDate: z.date().refine((d) => d instanceof Date, { message: "Please select a new date" }),
    newTime: z.string().min(1, "Please select a new time slot"),
    reason: z.string().max(300, "Reason must be 300 characters or less").optional(),
});

type RescheduleFormData = z.infer<typeof rescheduleSchema>;

const AVAILABLE_TIMES = ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

function RescheduleModal({ isOpen, onClose, appointment }: RescheduleModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<RescheduleFormData>({
        resolver: zodResolver(rescheduleSchema),
    });

    const selectedTime = watch("newTime");

    if (!isOpen || !appointment) return null;

    const handleClose = () => {
        reset();
        setIsSuccess(false);
        onClose();
    };

    const onSubmit = (_data: RescheduleFormData) => {
        setIsSubmitting(true);
        // Simulate API call — replace with real endpoint
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => handleClose(), 2500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-archivo font-bold text-neutral-900">Reschedule Appointment</h2>
                        <p className="text-sm text-neutral-500 font-poppins mt-0.5">Choose a new date and time for your consultation.</p>
                    </div>
                    <button onClick={handleClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <FiCheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold font-archivo text-neutral-900 mb-2">Appointment Rescheduled!</h3>
                            <p className="text-neutral-500 font-poppins text-sm">
                                Your appointment with {appointment.doctorName} has been updated. You'll receive a confirmation shortly.
                            </p>
                        </div>
                    ) : (
                        <form id="reschedule-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Current Appointment Summary */}
                            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-3">Current Appointment</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 border border-primary-200 overflow-hidden flex items-center justify-center shrink-0">
                                        {appointment.imageUrl ? (
                                            <img src={appointment.imageUrl} alt={appointment.doctorName} className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUserDoctor className="w-6 h-6 text-primary-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold font-archivo text-neutral-900 text-sm">{appointment.doctorName}</p>
                                        <p className="text-xs font-poppins text-neutral-500">{appointment.specialty}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-poppins text-neutral-500 flex items-center gap-1 justify-end">
                                            <FiCalendar className="w-3 h-3" /> {appointment.date}
                                        </p>
                                        <p className="text-xs font-poppins text-neutral-500 flex items-center gap-1 justify-end mt-0.5">
                                            <FiClock className="w-3 h-3" /> {appointment.time}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notice */}
                            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <FiAlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-poppins text-amber-800">
                                    Please reschedule at least 6 hours before your current appointment to avoid a cancellation fee.
                                </p>
                            </div>

                            {/* New Date */}
                            <Controller
                                name="newDate"
                                control={control}
                                render={({ field }) => (
                                    <FormDatePicker
                                        label="New Date"
                                        id="new-appointment-date"
                                        selected={field.value ?? null}
                                        onChange={field.onChange}
                                        minDate={new Date()}
                                        placeholderText="Pick a new appointment date"
                                        error={errors.newDate?.message}
                                    />
                                )}
                            />

                            {/* New Time Slot */}
                            <div>
                                <label className="block font-poppins text-sm font-semibold text-neutral-600 mb-2">New Time Slot</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {AVAILABLE_TIMES.map((time) => (
                                        <button
                                            type="button"
                                            key={time}
                                            onClick={() => setValue("newTime", time, { shouldValidate: true })}
                                            className={`py-2 px-1 rounded-lg border font-medium text-xs flex items-center justify-center transition-colors ${selectedTime === time
                                                    ? "bg-primary-50 text-primary-700 border-primary-500"
                                                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                                }`}
                                        >
                                            <FiClock className="mr-1 shrink-0" /> {time}
                                        </button>
                                    ))}
                                </div>
                                {errors.newTime && (
                                    <p className="mt-1.5 text-sm text-red-600 font-poppins">{errors.newTime.message}</p>
                                )}
                            </div>

                            {/* Reason (optional) */}
                            <div>
                                <label htmlFor="reschedule-reason" className="block font-poppins text-sm font-semibold text-neutral-600 mb-2">
                                    Reason for Rescheduling <span className="text-neutral-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    id="reschedule-reason"
                                    rows={2}
                                    placeholder="e.g. I have a work conflict on the original date..."
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg font-poppins text-sm text-neutral-900 placeholder-neutral-400 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                    onChange={(e) => setValue("reason", e.target.value)}
                                />
                            </div>

                        </form>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-neutral-100 bg-neutral-50 shrink-0 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-poppins font-semibold hover:bg-neutral-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="reschedule-form"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-xl font-poppins font-semibold hover:bg-primary-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : "Confirm Reschedule"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RescheduleModal;
