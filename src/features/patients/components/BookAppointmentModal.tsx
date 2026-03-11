import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiX, FiClock } from "react-icons/fi";
import FormDatePicker from "@/features/auth/components/FormDatePicker";

// ---- Zod Schema ----
const appointmentSchema = z.object({
    date: z.date().refine((d) => d instanceof Date, { message: "Please select a date" }),
    time: z.string().min(1, "Please select a time slot"),
    reason: z.string().max(500, "Reason must be 500 characters or less").optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// ---- Types ----
interface Doctor {
    id: string;
    name: string;
    specialty: string;
    imageUrl?: string;
}

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: Doctor | null;
}

const AVAILABLE_TIMES = ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

function BookAppointmentModal({ isOpen, onClose, doctor }: BookAppointmentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: { time: "", reason: "" },
    });

    const selectedTime = watch("time");

    if (!isOpen || !doctor) return null;

    const handleClose = () => {
        reset();
        setIsSuccess(false);
        onClose();
    };

    const onSubmit = (_data: AppointmentFormData) => {
        setIsSubmitting(true);
        // Simulate API call — replace with real API later
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <h2 className="text-xl font-archivo font-bold text-neutral-900">Book Appointment</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 font-poppins text-sm">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold font-archivo text-neutral-900 mb-2">Appointment Confirmed!</h3>
                            <p className="text-neutral-500">Your appointment with Dr. {doctor.name} has been scheduled.</p>
                        </div>
                    ) : (
                        <form id="appointment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Doctor Summary */}
                            <div className="flex items-center space-x-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                                <div className="w-14 h-14 rounded-full bg-primary-200 overflow-hidden flex items-center justify-center text-primary-700 font-bold font-archivo shrink-0">
                                    {doctor.imageUrl ? (
                                        <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        doctor.name.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold font-archivo text-neutral-900 text-base">Dr. {doctor.name}</h4>
                                    <p className="text-primary-700">{doctor.specialty}</p>
                                </div>
                            </div>

                            {/* Date Selection — react-datepicker via Controller */}
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <FormDatePicker
                                        label="Select Date"
                                        id="appointment-date"
                                        selected={field.value ?? null}
                                        onChange={field.onChange}
                                        minDate={new Date()}
                                        placeholderText="Pick an appointment date"
                                        error={errors.date?.message}
                                    />
                                )}
                            />

                            {/* Time Selection */}
                            <div>
                                <label className="block font-semibold text-neutral-900 mb-2">Available Times</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {AVAILABLE_TIMES.map((time) => (
                                        <button
                                            type="button"
                                            key={time}
                                            onClick={() => setValue("time", time, { shouldValidate: true })}
                                            className={`py-2 px-1 rounded-lg border font-medium text-xs sm:text-sm flex items-center justify-center transition-colors ${selectedTime === time
                                                ? "bg-primary-50 text-primary-700 border-primary-500"
                                                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                                }`}
                                        >
                                            <FiClock className="mr-1.5 shrink-0" /> {time}
                                        </button>
                                    ))}
                                </div>
                                {errors.time && (
                                    <p className="mt-1.5 text-sm text-red-600 font-poppins">{errors.time.message}</p>
                                )}
                            </div>

                            {/* Reason for Visit */}
                            <div>
                                <label htmlFor="reason" className="block font-semibold text-neutral-900 mb-2">
                                    Reason for Visit <span className="text-neutral-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    id="reason"
                                    rows={3}
                                    className={`w-full p-4 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm resize-none ${errors.reason ? "border-red-500" : "border-neutral-200"
                                        }`}
                                    placeholder="Briefly describe your symptoms or reason for the appointment..."
                                    onChange={(e) => setValue("reason", e.target.value)}
                                />
                                {errors.reason && (
                                    <p className="mt-1 text-sm text-red-600 font-poppins">{errors.reason.message}</p>
                                )}
                            </div>

                        </form>
                    )}
                </div>

                {/* Footer Actions */}
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
                            form="appointment-form"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-xl font-poppins font-semibold hover:bg-primary-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : "Confirm Booking"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookAppointmentModal;
