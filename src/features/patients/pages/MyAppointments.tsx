import { useState, useRef, useEffect } from "react";
import { FiCalendar, FiClock, FiVideo, FiFileText, FiMoreVertical, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import VisitSummaryModal, { type VisitSummary } from "../components/VisitSummaryModal";
import RescheduleModal, { type AppointmentToReschedule } from "../components/RescheduleModal";
import BookAppointmentModal from "../components/BookAppointmentModal";
import { useAppointments, useCancelAppointment } from "@/features/appointments/hooks/useAppointments";
import type { Appointment } from "@/types";

// ---- Display Shape ----
interface DisplayAppointment {
    id: string;
    doctorId: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
    noShowBy: string | null;
    rawDate: string;
    rawStartTime: string;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

function to12h(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

function canJoinCall(date: string, startTime: string): boolean {
    try {
        // Normalize date to YYYY-MM-DD
        const normalizedDate = date.includes('T') ? date.split('T')[0] : date;
        // Normalize time to HH:mm (handle HH:mm:ss from backend)
        const normalizedTime = startTime.split(':').slice(0, 2).join(':');
        const appointmentStart = new Date(`${normalizedDate}T${normalizedTime}:00`);

        if (isNaN(appointmentStart.getTime())) return false;

        const openAt = new Date(appointmentStart.getTime() - 10 * 60 * 1000);
        return new Date() >= openAt;
    } catch (e) {
        return false;
    }
}

const STATUS_LABEL: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
};

function mapToDisplay(appt: Appointment): DisplayAppointment {
    const nameParts = [appt.doctor?.firstName, appt.doctor?.lastName].filter(Boolean);
    const rawName = nameParts.join(' ') || 'Doctor';
    const doctorName = rawName.startsWith('Dr.') ? rawName : `Dr. ${rawName}`;
    return {
        id: appt.id,
        doctorId: appt.doctor?.id ?? appt.doctorId,
        doctorName,
        specialty: appt.doctor?.specialty?.name ?? '',
        date: formatDate(appt.date),
        time: `${to12h(appt.startTime)} - ${to12h(appt.endTime)}`,
        status: STATUS_LABEL[appt.status] ?? appt.status,
        noShowBy: appt.noShowBy ?? null,
        rawDate: appt.date,
        rawStartTime: appt.startTime,
    };
}

// ---- Dropdown Menu Component ----
function AppointmentMenu({
    appointment,
    onReschedule,
    onCancel,
}: {
    appointment: DisplayAppointment;
    onReschedule: (appt: DisplayAppointment) => void;
    onCancel: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="p-2.5 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
            >
                <FiMoreVertical className="w-5 h-5" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 z-20 overflow-hidden animate-fade-in">
                    <button
                        onClick={() => { setOpen(false); onReschedule(appointment); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-poppins text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                        <FiRefreshCw className="w-4 h-4 text-primary-500" />
                        Reschedule
                    </button>
                    <div className="border-t border-neutral-100" />
                    <button
                        onClick={() => { setOpen(false); onCancel(appointment.id); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-poppins text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <FiXCircle className="w-4 h-4" />
                        Cancel Appointment
                    </button>
                </div>
            )}
        </div>
    );
}

// ---- Main Page ----
function MyAppointments() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
    const [selectedSummary, setSelectedSummary] = useState<VisitSummary | null>(null);
    const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentToReschedule | null>(null);
    const [rebookDoctor, setRebookDoctor] = useState<{ id: string; name: string; specialty: string } | null>(null);

    const { data, isLoading } = useAppointments();
    const { mutate: cancelAppointment } = useCancelAppointment();

    const all = data?.appointments ?? [];

    const upcomingAppointments = all
        .filter(a => a.status === 'pending' || a.status === 'confirmed')
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
        .map(mapToDisplay);

    const pastAppointments = all
        .filter(a => a.status === 'completed' || a.status === 'cancelled' || a.status === 'no_show')
        .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))
        .map(mapToDisplay);

    const appointmentsToShow = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

    const handleCancel = (id: string) => cancelAppointment(id);

    const handleReschedule = (appt: DisplayAppointment) => {
        setRescheduleAppointment({
            id: appt.id,
            doctorName: appt.doctorName,
            specialty: appt.specialty,
            date: appt.date,
            time: appt.time,
        });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">My Appointments</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    Manage your upcoming consultations and review your past visits.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-6 py-3 font-poppins text-sm font-semibold transition-colors border-b-2 ${activeTab === "upcoming"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab("past")}
                    className={`px-6 py-3 font-poppins text-sm font-semibold transition-colors border-b-2 ${activeTab === "past"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                        }`}
                >
                    Past
                </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 h-28 animate-pulse" />
                    ))
                ) : appointmentsToShow.length > 0 ? (
                    appointmentsToShow.map((appointment) => (
                        <div key={appointment.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">

                            {/* Left Side: Doctor Info & Date */}
                            <div className="flex items-start sm:items-center space-x-4 flex-1">
                                <div className="w-16 h-16 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                                    <FaUserDoctor className="w-8 h-8 text-primary-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-archivo font-bold text-lg text-neutral-900">{appointment.doctorName}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-poppins uppercase tracking-wide ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                appointment.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                    appointment.status === 'No Show' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-neutral-100 text-neutral-600'
                                            }`}>
                                            {appointment.status === 'No Show' && appointment.noShowBy
                                                ? `No Show by ${appointment.noShowBy.charAt(0).toUpperCase() + appointment.noShowBy.slice(1)}`
                                                : appointment.status}
                                        </span>
                                    </div>
                                    <p className="font-poppins text-sm text-neutral-500 mb-2">{appointment.specialty}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm font-poppins text-neutral-700">
                                        <span className="flex items-center"><FiCalendar className="mr-1.5 text-neutral-400" /> {appointment.date}</span>
                                        <span className="flex items-center"><FiClock className="mr-1.5 text-neutral-400" /> {appointment.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Actions */}
                            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t border-neutral-100 pt-4 md:border-t-0 md:pt-0">
                                {activeTab === "upcoming" ? (
                                    <>
                                        <button
                                            onClick={() => navigate(`/patient/call/${appointment.id}`)}
                                            disabled={!canJoinCall(appointment.rawDate, appointment.rawStartTime)}
                                            title={canJoinCall(appointment.rawDate, appointment.rawStartTime) ? undefined : "Available 10 minutes before the appointment"}
                                            className="flex-1 md:flex-none flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-500">
                                            <FiVideo className="mr-2" /> Join Call
                                        </button>
                                        <AppointmentMenu
                                            appointment={appointment}
                                            onReschedule={handleReschedule}
                                            onCancel={handleCancel}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => selectedSummary && setSelectedSummary(null)}
                                            disabled
                                            className="flex-1 md:flex-none flex items-center justify-center bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <FiFileText className="mr-2 text-neutral-500" /> View Notes
                                        </button>
                                        <button
                                            onClick={() => setRebookDoctor({ id: appointment.doctorId, name: appointment.doctorName, specialty: appointment.specialty })}
                                            className="flex-1 md:flex-none flex items-center justify-center bg-primary-50 text-primary-700 hover:bg-primary-100 px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors">
                                            Re-book
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl">
                        <p className="text-neutral-500 font-poppins mb-2">You have no {activeTab} appointments.</p>
                        {activeTab === "upcoming" && (
                            <button className="text-primary-600 font-semibold font-poppins hover:text-primary-700">
                                Find a Doctor to book one
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Visit Summary Modal */}
            <VisitSummaryModal
                isOpen={!!selectedSummary}
                onClose={() => setSelectedSummary(null)}
                summary={selectedSummary}
            />

            {/* Reschedule Modal */}
            <RescheduleModal
                isOpen={!!rescheduleAppointment}
                onClose={() => setRescheduleAppointment(null)}
                appointment={rescheduleAppointment}
            />

            {/* Re-book Modal */}
            <BookAppointmentModal
                isOpen={!!rebookDoctor}
                onClose={() => setRebookDoctor(null)}
                doctor={rebookDoctor}
            />
        </div>
    );
}

export default MyAppointments;
