import { useParams, useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiCalendar, FiClock, FiUser, FiAlertTriangle,
    FiVideo, FiMapPin, FiFileText,
} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { useAdminAppointment } from "@/features/admin/hooks/useAdmin";
import type { AppointmentStatus } from "@/types";

const STATUS_STYLES: Record<AppointmentStatus, string> = {
    pending:     "bg-amber-50 text-amber-700 border-amber-200",
    confirmed:   "bg-blue-50 text-blue-700 border-blue-200",
    completed:   "bg-green-50 text-green-700 border-green-200",
    cancelled:   "bg-red-50 text-red-700 border-red-200",
    rescheduled: "bg-purple-50 text-purple-700 border-purple-200",
    no_show:     "bg-neutral-100 text-neutral-600 border-neutral-200",
    expired:     "bg-neutral-100 text-neutral-500 border-neutral-200",
};

function to12h(time: string | undefined) {
    if (!time) return "—";
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
}

function AdminAppointmentDetail() {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const { data: appt, isLoading } = useAdminAppointment(appointmentId ?? "");

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 bg-neutral-100 rounded" />
                <div className="h-48 bg-neutral-100 rounded-2xl" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-48 bg-neutral-100 rounded-2xl" />
                    <div className="h-48 bg-neutral-100 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!appt) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FiAlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
                <h2 className="text-lg font-archivo font-bold text-neutral-900">Appointment Not Found</h2>
                <button
                    onClick={() => navigate("/admin/appointments")}
                    className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg font-poppins text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                    Back to Appointments
                </button>
            </div>
        );
    }

    const patientName = [appt.patient?.firstName, appt.patient?.lastName].filter(Boolean).join(" ") || "Unknown Patient";
    const doctorName = [appt.doctor?.firstName, appt.doctor?.lastName].filter(Boolean).join(" ") || "Unknown Doctor";
    const patientInitials = [appt.patient?.firstName, appt.patient?.lastName].filter(Boolean).map(n => n![0]).join("") || "?";
    const doctorInitials = [appt.doctor?.firstName, appt.doctor?.lastName].filter(Boolean).map(n => n![0]).join("") || "?";

    return (
        <div className="animate-fade-in-up">
            <button
                onClick={() => navigate("/admin/appointments")}
                className="flex items-center space-x-2 text-sm font-poppins font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-6"
            >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Appointments</span>
            </button>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-archivo font-bold text-neutral-900">Appointment Detail</h1>
                        <p className="text-xs font-poppins font-mono text-neutral-400 mt-1">ID: {appt.id}</p>
                    </div>
                    <span className={`inline-flex items-center text-sm font-bold font-poppins px-4 py-2 rounded-xl border capitalize ${STATUS_STYLES[appt.status]}`}>
                        {appt.status.replace("_", " ")}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Details */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-archivo font-bold text-neutral-900 flex items-center gap-2">
                        <FiCalendar className="text-primary-500" /> Appointment Details
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center gap-2"><FiCalendar className="w-4 h-4" /> Date</span>
                            <span className="font-semibold text-neutral-900 text-right">{formatDate(appt.date)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center gap-2"><FiClock className="w-4 h-4" /> Time</span>
                            <span className="font-semibold text-neutral-900">{to12h(appt.startTime)} – {to12h(appt.endTime)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center gap-2">
                                {appt.type === "video" ? <FiVideo className="w-4 h-4" /> : <FiMapPin className="w-4 h-4" />} Type
                            </span>
                            <span className="font-semibold text-neutral-900 capitalize">{appt.type}</span>
                        </div>
                        {appt.reason && (
                            <div className="flex items-start gap-2 pt-2 border-t border-neutral-100">
                                <FiFileText className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold font-poppins text-neutral-400 uppercase tracking-wider mb-1">Reason</p>
                                    <p className="text-sm font-poppins text-neutral-700">{appt.reason}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Patient */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-archivo font-bold text-neutral-900 flex items-center gap-2">
                        <FiUser className="text-primary-500" /> Patient
                    </h3>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-sm shrink-0 uppercase">
                            {patientInitials}
                        </div>
                        <div>
                            <p className="text-sm font-semibold font-poppins text-neutral-900">{patientName}</p>
                            <button
                                onClick={() => navigate(`/admin/patients/${appt.patientId}`)}
                                className="text-xs font-poppins text-primary-500 hover:text-primary-700 font-semibold transition-colors"
                            >
                                View Profile →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctor */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4 lg:col-span-2">
                    <h3 className="text-base font-archivo font-bold text-neutral-900 flex items-center gap-2">
                        <FaUserDoctor className="text-primary-500" /> Doctor
                    </h3>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold font-archivo text-sm shrink-0 uppercase">
                            {doctorInitials}
                        </div>
                        <div>
                            <p className="text-sm font-semibold font-poppins text-neutral-900">Dr. {doctorName}</p>
                            {appt.doctor?.specialty?.name && (
                                <p className="text-xs font-poppins text-neutral-500">{appt.doctor.specialty.name}</p>
                            )}
                            <button
                                onClick={() => navigate(`/admin/doctors/${appt.doctorId}`)}
                                className="text-xs font-poppins text-primary-500 hover:text-primary-700 font-semibold transition-colors"
                            >
                                View Doctor Profile →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAppointmentDetail;
