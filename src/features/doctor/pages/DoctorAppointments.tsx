import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { FiCalendar, FiVideo, FiClock, FiSearch, FiFilter, FiPlus, FiX, FiRefreshCw, FiCheck, FiAlertTriangle, FiFileText } from "react-icons/fi";
import ScheduleAppointmentModal from "../components/ScheduleAppointmentModal";
import ConsultationNoteModal from "../components/ConsultationNoteModal";
import { useAppointments, useConfirmAppointment, useCancelAppointment, useUpdateAppointment } from "@/features/appointments/hooks/useAppointments";
import { useConsultationNotes } from "@/features/consultations/hooks/useConsultations";
import { useAppointmentPrescriptions } from "@/features/prescriptions/hooks/usePrescriptions";
import { useAppointmentLabResults } from "@/features/labs/hooks/useLabs";
import type { Appointment } from "@/types";

type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled";

interface DisplayAppointment {
    id: string;
    patient: string;
    initials: string;
    type: string;
    date: string;
    rawDate: string;
    rawStartTime: string;
    rawEndTime: string;
    time: string;
    status: AppointmentStatus;
    notes?: string;
    patientId: string;
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

function addMinutes(time24: string, mins: number): string {
    const [h, m] = time24.split(':').map(Number);
    const total = h * 60 + m + mins;
    return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

function canJoinCall(date: string, startTime: string): boolean {
    try {
        const normalizedDate = date.includes('T') ? date.split('T')[0] : date;
        const normalizedTime = startTime.split(':').slice(0, 2).join(':');
        const appointmentStart = new Date(`${normalizedDate}T${normalizedTime}:00`);
        if (isNaN(appointmentStart.getTime())) return false;
        const openAt = new Date(appointmentStart.getTime() - 10 * 60 * 1000);
        return new Date() >= openAt;
    } catch (e) {
        return false;
    }
}

function mapToDisplay(appt: Appointment): DisplayAppointment {
    const nameParts = [appt.patient?.firstName, appt.patient?.lastName].filter(Boolean);
    const patient = nameParts.join(' ') || 'Unknown Patient';
    const initials = nameParts.map(n => n![0]).join('') || '?';
    return {
        id: appt.id,
        patient,
        initials,
        type: appt.type,
        date: formatDate(appt.date),
        rawDate: appt.date,
        rawStartTime: appt.startTime,
        rawEndTime: appt.endTime,
        time: `${to12h(appt.startTime)} – ${to12h(appt.endTime)}`,
        status: appt.status as AppointmentStatus,
        notes: appt.reason,
        patientId: appt.patientId || appt.patient?.id || '',
    };
}

const statusStyles: Record<AppointmentStatus, string> = {
    confirmed: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-600",
};

const tabs: { label: string; value: string }[] = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

// ── Accept Modal ──────────────────────────────────────────────────────────────
function AcceptModal({ appt, onClose, onConfirm, isPending }: {
    appt: DisplayAppointment;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <FiCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-archivo font-bold text-neutral-900">Accept Appointment</h2>
                </div>
                <p className="font-poppins text-sm text-neutral-600 mb-1">
                    Accept the appointment with <span className="font-semibold text-neutral-900">{appt.patient}</span>?
                </p>
                <p className="font-poppins text-sm text-neutral-500 mb-6">
                    {appt.date} · {appt.time}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-neutral-200 font-poppins font-semibold text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        Not Now
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-poppins font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Accepting…' : 'Accept'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Cancel Modal ──────────────────────────────────────────────────────────────
function CancelModal({ appt, onClose, onConfirm, isPending }: {
    appt: DisplayAppointment;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <FiAlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <h2 className="text-lg font-archivo font-bold text-neutral-900">Cancel Appointment</h2>
                </div>
                <p className="font-poppins text-sm text-neutral-600 mb-1">
                    Cancel the appointment with <span className="font-semibold text-neutral-900">{appt.patient}</span>?
                </p>
                <p className="font-poppins text-sm text-neutral-500 mb-6">
                    {appt.date} · {appt.time}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-neutral-200 font-poppins font-semibold text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        Keep It
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-poppins font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Cancelling…' : 'Cancel Appointment'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Reschedule Modal ──────────────────────────────────────────────────────────
function RescheduleModal({ appt, onClose, onConfirm, isPending }: {
    appt: DisplayAppointment;
    onClose: () => void;
    onConfirm: (date: string, startTime: string, endTime: string) => void;
    isPending: boolean;
}) {
    const [newDate, setNewDate] = useState(appt.rawDate);
    const [newTime, setNewTime] = useState(appt.rawStartTime);

    const handleSubmit = () => {
        if (!newDate || !newTime) return;
        onConfirm(newDate, newTime, addMinutes(newTime, 30));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                            <FiRefreshCw className="w-5 h-5 text-primary-600" />
                        </div>
                        <h2 className="text-lg font-archivo font-bold text-neutral-900">Reschedule</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors">
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
                <p className="font-poppins text-sm text-neutral-500 mb-5">
                    Rescheduling appointment with <span className="font-semibold text-neutral-800">{appt.patient}</span>
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-poppins font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">New Date</label>
                        <input
                            type="date"
                            value={newDate}
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-poppins font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">New Start Time</label>
                        <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                        <p className="mt-1 text-xs font-poppins text-neutral-400">Session duration is 30 minutes</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-neutral-200 font-poppins font-semibold text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !newDate || !newTime}
                        className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-poppins font-semibold text-sm hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
function DoctorAppointments() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const [acceptTarget, setAcceptTarget] = useState<DisplayAppointment | null>(null);
    const [cancelTarget, setCancelTarget] = useState<DisplayAppointment | null>(null);
    const [rescheduleTarget, setRescheduleTarget] = useState<DisplayAppointment | null>(null);
    const [editNotesTarget, setEditNotesTarget] = useState<DisplayAppointment | null>(null);

    const { data, isLoading } = useAppointments();
    const { mutate: confirmAppointment, isPending: isConfirming } = useConfirmAppointment();
    const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
    const { mutate: updateAppointment, isPending: isRescheduling } = useUpdateAppointment();
    
    // Fetch data for the selected appointment (for editing notes)
    const { data: existingNotes } = useConsultationNotes(editNotesTarget?.id ?? '');
    const { data: rxData } = useAppointmentPrescriptions(editNotesTarget?.id ?? '');
    const { data: existingLabOrders } = useAppointmentLabResults(editNotesTarget?.id ?? '');
    const existingPrescription = Array.isArray(rxData) ? rxData[0] : rxData;

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const appointments = (data?.appointments ?? []).map(mapToDisplay);

    const filtered = appointments.filter((a) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "today" && a.rawDate === today) ||
            (activeTab === "upcoming" && (a.status === "confirmed" || a.status === "pending") && a.rawDate >= today) ||
            a.status === activeTab;
        const matchesSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Appointments</h1>
                    <p className="text-neutral-600 font-poppins text-sm">Manage your upcoming, past, and pending appointments.</p>
                </div>
                <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-poppins font-bold text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>New Appointment</span>
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search patient or type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-poppins text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                    <FiFilter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1 w-fit overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 rounded-lg font-poppins text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.value
                            ? "bg-white text-primary-700 shadow-sm font-semibold"
                            : "text-neutral-600 hover:text-neutral-900"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-5 h-16 animate-pulse bg-neutral-50" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiCalendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <p className="font-poppins text-neutral-500">No appointments found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {filtered.map((appt) => (
                            <div key={appt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                                {/* Left: Patient info */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-sm shrink-0">
                                        {appt.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold font-poppins text-neutral-900">{appt.patient}</p>
                                        <p className="text-xs font-poppins text-neutral-500 capitalize">{appt.type}</p>
                                        {appt.notes && (
                                            <p className="text-xs font-poppins text-neutral-400 italic mt-0.5">{appt.notes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Date, status, actions */}
                                <div className="flex flex-wrap items-center gap-3 ml-15 sm:ml-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-semibold font-poppins text-neutral-900">{appt.date}</p>
                                        <p className="text-xs font-poppins text-neutral-500 flex items-center sm:justify-end mt-0.5">
                                            <FiClock className="w-3 h-3 mr-1" />{appt.time}
                                        </p>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold font-poppins capitalize ${statusStyles[appt.status]}`}>
                                        {appt.status}
                                    </span>

                                    {/* Action buttons */}
                                    {appt.status === "pending" && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setAcceptTarget(appt)}
                                                className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-poppins font-semibold text-xs transition-colors flex items-center gap-1.5"
                                            >
                                                <FiCheck className="w-3.5 h-3.5" /> Accept
                                            </button>
                                            <button
                                                onClick={() => setRescheduleTarget(appt)}
                                                className="px-3 py-1.5 rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100 font-poppins font-semibold text-xs transition-colors flex items-center gap-1.5"
                                            >
                                                <FiRefreshCw className="w-3.5 h-3.5" /> Reschedule
                                            </button>
                                            <button
                                                onClick={() => setCancelTarget(appt)}
                                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-poppins font-semibold text-xs transition-colors flex items-center gap-1.5"
                                            >
                                                <FiX className="w-3.5 h-3.5" /> Cancel
                                            </button>
                                        </div>
                                    )}

                                    {appt.status === "confirmed" && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setRescheduleTarget(appt)}
                                                className="px-3 py-1.5 rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100 font-poppins font-semibold text-xs transition-colors flex items-center gap-1.5"
                                            >
                                                <FiRefreshCw className="w-3.5 h-3.5" /> Reschedule
                                            </button>
                                            {appt.type === "video" && (
                                                <button
                                                    onClick={() => canJoinCall(appt.rawDate, appt.rawStartTime) && navigate(`/doctor/call/${appt.id}`)}
                                                    disabled={!canJoinCall(appt.rawDate, appt.rawStartTime)}
                                                    title={canJoinCall(appt.rawDate, appt.rawStartTime) ? undefined : "Available 10 minutes before the appointment"}
                                                    className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 disabled:text-primary-400 disabled:border-primary-100 disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-semibold text-xs transition-colors flex items-center gap-1.5"
                                                >
                                                    <FiVideo className="w-3.5 h-3.5" /> Join Call
                                                </button>
                                            )}
                                        </div>
                                    )}
                                     {appt.status === "completed" && (
                                        <button
                                            onClick={() => setEditNotesTarget(appt)}
                                            className="px-3 py-1.5 rounded-lg bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50 font-poppins font-semibold text-xs transition-colors flex items-center gap-1.5"
                                        >
                                            <FiFileText className="w-3.5 h-3.5" /> Edit Notes
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {acceptTarget && (
                <AcceptModal
                    appt={acceptTarget}
                    onClose={() => setAcceptTarget(null)}
                    isPending={isConfirming}
                    onConfirm={() => confirmAppointment(acceptTarget.id, { onSuccess: () => setAcceptTarget(null) })}
                />
            )}
            {cancelTarget && (
                <CancelModal
                    appt={cancelTarget}
                    onClose={() => setCancelTarget(null)}
                    isPending={isCancelling}
                    onConfirm={() => cancelAppointment(cancelTarget.id, { onSuccess: () => setCancelTarget(null) })}
                />
            )}
            {rescheduleTarget && (
                <RescheduleModal
                    appt={rescheduleTarget}
                    onClose={() => setRescheduleTarget(null)}
                    isPending={isRescheduling}
                    onConfirm={(date, startTime, endTime) =>
                        updateAppointment(
                            { id: rescheduleTarget.id, date, startTime, endTime },
                            { onSuccess: () => setRescheduleTarget(null) }
                        )
                    }
                />
            )}

            <ScheduleAppointmentModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
            />

            <ConsultationNoteModal
                key={editNotesTarget?.id ?? 'new'}
                isOpen={!!editNotesTarget}
                onClose={() => setEditNotesTarget(null)}
                patientName={editNotesTarget?.patient ?? ''}
                appointmentId={editNotesTarget?.id ?? ''}
                patientId={editNotesTarget?.patientId ?? ''}
                existingNotes={existingNotes}
                existingPrescription={existingPrescription}
                existingLabOrders={existingLabOrders}
            />
        </div>
    );
}

export default DoctorAppointments;
