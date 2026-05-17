import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft, FiCalendar, FiMessageSquare, FiVideo,
    FiFileText, FiActivity, FiHeart, FiDroplet, FiAlertCircle, FiCheckCircle,
    FiUploadCloud, FiUser
} from "react-icons/fi";
import ScheduleAppointmentModal from "../components/ScheduleAppointmentModal";
import ConsultationNoteModal from "../components/ConsultationNoteModal";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useConsultationNotes } from "@/features/consultations/hooks/useConsultations";
import { useAppointmentPrescriptions } from "@/features/prescriptions/hooks/usePrescriptions";
import type { Appointment } from "@/types";

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

function statusLabel(status: Appointment['status']): { label: string; className: string } {
    switch (status) {
        case 'completed': return { label: 'Completed', className: 'bg-neutral-50 text-neutral-500 border-neutral-200' };
        case 'confirmed': return { label: 'Confirmed', className: 'bg-green-50 text-green-600 border-green-100' };
        case 'pending':   return { label: 'Pending', className: 'bg-amber-50 text-amber-600 border-amber-100' };
        case 'cancelled': return { label: 'Cancelled', className: 'bg-red-50 text-red-500 border-red-100' };
        case 'no_show':   return { label: 'No Show', className: 'bg-orange-50 text-orange-600 border-orange-100' };
        default:          return { label: 'Unknown', className: 'bg-neutral-50 text-neutral-500 border-neutral-200' };
    }
}

const vitals = [
    { label: "Blood Pressure", value: "—", icon: FiHeart, color: "text-red-500", bg: "bg-red-50" },
    { label: "Heart Rate", value: "—", icon: FiActivity, color: "text-pink-500", bg: "bg-pink-50" },
    { label: "Blood Glucose", value: "—", icon: FiDroplet, color: "text-blue-500", bg: "bg-blue-50" },
];

function DoctorPatientDetail() {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [dismissedNoteIds, setDismissedNoteIds] = useState<Set<string>>(new Set());
    const [mainTab, setMainTab] = useState<"timeline" | "results" | "records">("timeline");
    const { data, isLoading } = useAppointments();
    
    // Fetch data for the selected appointment if any (for editing/viewing)
    const { data: existingNotes } = useConsultationNotes(selectedAppointmentId ?? '');
    const { data: existingPrescriptions } = useAppointmentPrescriptions(selectedAppointmentId ?? '');
    const existingPrescription = Array.isArray(existingPrescriptions) ? existingPrescriptions[0] : existingPrescriptions;
    const allAppointments = data?.appointments ?? [];

    const patientAppointments = allAppointments
        .filter(a => (a.patient?.id ?? a.patientId) === patientId)
        .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime));

    const patient = patientAppointments[0]?.patient;
    const nameParts = [patient?.firstName, patient?.lastName].filter(Boolean);
    const patientName = nameParts.join(' ') || 'Unknown Patient';
    const initials = nameParts.map(n => n![0]).join('').toUpperCase() || '?';

    const upcomingAppt = patientAppointments.find(
        a => (a.status === 'confirmed' || a.status === 'pending') && a.date >= new Date().toISOString().slice(0, 10)
    );

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 w-48 bg-neutral-200 rounded-lg" />
                <div className="h-48 bg-neutral-200 rounded-[2.5rem]" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 bg-neutral-200 rounded-[2.5rem]" />
                    <div className="h-96 bg-neutral-200 rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    if (!isLoading && patientAppointments.length === 0) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <Link to="/doctor/patients" className="inline-flex items-center text-sm font-poppins font-semibold text-neutral-500 hover:text-primary-600 transition-colors group">
                    <div className="p-2 bg-white rounded-lg border border-neutral-200 mr-3 group-hover:border-primary-100 transition-all">
                        <FiArrowLeft className="w-4 h-4" />
                    </div>
                    Back to My Patients
                </Link>
                <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
                    <FiUser className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="font-poppins text-neutral-500">Patient not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link to="/doctor/patients" className="inline-flex items-center text-sm font-poppins font-semibold text-neutral-500 hover:text-primary-600 transition-colors group">
                    <div className="p-2 bg-white rounded-lg border border-neutral-200 mr-3 group-hover:border-primary-100 transition-all">
                        <FiArrowLeft className="w-4 h-4" />
                    </div>
                    Back to My Patients
                </Link>
                <div className="flex items-center space-x-3">
                    {upcomingAppt && (
                        <button
                            onClick={() => navigate(`/doctor/call/${upcomingAppt.id}`)}
                            className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold font-poppins text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center space-x-2"
                        >
                            <FiVideo className="w-4 h-4" />
                            <span>Join Call</span>
                        </button>
                    )}
                    <button className="p-3 bg-white border border-neutral-200 text-neutral-500 rounded-2xl hover:bg-neutral-50 transition-all shadow-sm">
                        <FiMessageSquare className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Patient Hero Card */}
            <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm p-8 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold font-archivo text-3xl shadow-inner animate-scale-in">
                        {initials}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-archivo font-bold text-neutral-900 leading-none">{patientName}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-poppins uppercase tracking-wider border ${upcomingAppt ? 'bg-green-50 text-green-600 border-green-100' : 'bg-neutral-100 text-neutral-500 border-neutral-200'}`}>
                                {upcomingAppt ? 'Active Patient' : 'Inactive'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-500 font-poppins text-sm">
                            <span className="flex items-center"><FiCalendar className="mr-2 text-neutral-400" /> {patientAppointments.length} appointment{patientAppointments.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsApptModalOpen(true)}
                            className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold font-poppins text-sm hover:bg-black transition-all"
                        >
                            Schedule Appointment
                        </button>
                    </div>
                </div>

                {/* Patient Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-10 pt-8 border-t border-neutral-100">
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-1">Total Visits</p>
                        <p className="text-sm font-bold font-archivo text-primary-600">{patientAppointments.length}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-1">Last Visit</p>
                        <p className="text-sm font-archivo text-neutral-900">
                            {patientAppointments.find(a => a.status === 'completed')
                                ? formatDate(patientAppointments.find(a => a.status === 'completed')!.date)
                                : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-1">Next Appointment</p>
                        <p className="text-sm font-archivo text-neutral-900">
                            {upcomingAppt ? `${formatDate(upcomingAppt.date)}, ${to12h(upcomingAppt.startTime)}` : '—'}
                        </p>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Visit Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                            <div className="flex items-center space-x-1 bg-neutral-100 rounded-xl p-1">
                                <button
                                    onClick={() => setMainTab("timeline")}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-poppins text-sm font-semibold transition-colors ${mainTab === "timeline" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                                >
                                    <FiCalendar className="w-4 h-4" />
                                    <span>Visit Timeline</span>
                                </button>
                                <button
                                    onClick={() => setMainTab("results")}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-poppins text-sm font-semibold transition-colors ${mainTab === "results" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                                >
                                    <FiUploadCloud className="w-4 h-4" />
                                    <span>Lab Results</span>
                                </button>
                            </div>
                            <span className="text-xs font-poppins font-bold text-neutral-400 uppercase tracking-widest">
                                {mainTab === "timeline" ? `${patientAppointments.length} VISITS` : "0 TESTS"}
                            </span>
                        </div>

                        {/* Visit Timeline */}
                        {mainTab === "timeline" && (
                            <div className="p-8 space-y-10 relative">
                                <div className="absolute left-11 top-10 bottom-10 w-0.5 bg-neutral-100" />

                                {patientAppointments.map((appt, index) => {
                                    const { label, className } = statusLabel(appt.status);
                                    const isPending = appt.status === 'confirmed' || appt.status === 'pending';
                                    return (
                                        <div key={appt.id} className="relative pl-16 group animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                                            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full border-4 border-white z-10 transition-transform group-hover:scale-125 ${appt.status === 'completed' ? 'bg-primary-500 shadow-[0_0_10px_rgba(99,106,232,0.4)]' : appt.status === 'cancelled' ? 'bg-neutral-300' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'}`} />

                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <p className={`text-sm font-bold font-poppins ${appt.status === 'completed' ? 'text-primary-600' : appt.status === 'cancelled' ? 'text-neutral-400' : 'text-amber-600'}`}>
                                                            {formatDate(appt.date)} · {to12h(appt.startTime)}
                                                        </p>
                                                        <h3 className="text-lg font-archivo font-bold text-neutral-900 mt-0.5 capitalize">{appt.type} Consultation</h3>
                                                    </div>
                                                    <span className={`self-start sm:self-auto px-3 py-1 rounded-lg text-[10px] font-bold font-poppins uppercase tracking-wider border ${className}`}>
                                                        {label}
                                                    </span>
                                                </div>

                                                {appt.reason && (
                                                    <div className="bg-neutral-50/50 rounded-3xl p-6 border border-neutral-100 group-hover:border-primary-100 group-hover:bg-primary-50/20 transition-all">
                                                        <h4 className="flex items-center text-xs font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-2">
                                                            <FiFileText className="mr-2 text-primary-400" /> Reason
                                                        </h4>
                                                        <p className="text-sm text-neutral-700 font-poppins leading-relaxed italic">"{appt.reason}"</p>
                                                    </div>
                                                )}

                                                {appt.status === 'completed' && (
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => { 
                                                                setSelectedAppointmentId(appt.id); 
                                                                setIsNoteModalOpen(true); 
                                                            }}
                                                            className="flex items-center space-x-2 px-6 py-2.5 bg-white border-2 border-primary-500 text-primary-600 rounded-2xl font-bold font-poppins text-xs hover:bg-primary-50 transition-all shadow-sm"
                                                        >
                                                            <FiFileText className="w-4 h-4" />
                                                            <span>View/Edit Consultation Notes</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {isPending && !dismissedNoteIds.has(appt.id) && !appt.reason && (
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-50/30 rounded-3xl p-6 border border-amber-100 group-hover:border-amber-200 transition-all">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                                                                <FiAlertCircle className="w-5 h-5 animate-bounce" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold font-poppins text-amber-900">Upcoming Appointment</p>
                                                                <p className="text-xs font-poppins text-amber-700">No notes yet — session hasn't occurred.</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => { setSelectedAppointmentId(appt.id); setIsNoteModalOpen(true); setDismissedNoteIds(prev => { const s = new Set(prev); s.delete(appt.id); return s; }); }}
                                                            className="px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold font-poppins text-sm shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all shrink-0"
                                                        >
                                                            Add Note
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Lab Results Tab — placeholder */}
                        {mainTab === "results" && (
                            <div className="p-12 text-center">
                                <FiUploadCloud className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                                <p className="font-poppins text-neutral-400 text-sm">No lab results on file for this patient.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Vitals */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm p-8">
                        <h2 className="text-xl font-archivo font-bold text-neutral-900 mb-8">Latest Vitals</h2>
                        <div className="space-y-6">
                            {vitals.map((v) => (
                                <div key={v.label} className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${v.bg}`}>
                                            <v.icon className={`w-6 h-6 ${v.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins">{v.label}</p>
                                            <p className="text-base font-bold font-archivo text-neutral-400">{v.value}</p>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 bg-neutral-50 text-neutral-400 text-[10px] font-bold rounded-lg border border-neutral-200">
                                        N/A
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-center text-xs font-poppins text-neutral-400">Vitals not yet available</p>
                    </div>

                    {/* Appointment Summary */}
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm p-8">
                        <h2 className="text-xl font-archivo font-bold text-neutral-900 mb-6 flex items-center">
                            <FiCheckCircle className="mr-3 text-primary-400" /> Visit Summary
                        </h2>
                        <div className="space-y-3">
                            {(['completed', 'confirmed', 'pending', 'cancelled'] as const).map(status => {
                                const count = patientAppointments.filter(a => a.status === status).length;
                                if (count === 0) return null;
                                const { label, className } = statusLabel(status);
                                return (
                                    <div key={status} className="flex items-center justify-between">
                                        <span className={`text-[10px] font-bold font-poppins px-2.5 py-1 rounded-full border ${className}`}>{label}</span>
                                        <span className="text-sm font-bold font-archivo text-neutral-800">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <ScheduleAppointmentModal
                isOpen={isApptModalOpen}
                onClose={() => setIsApptModalOpen(false)}
                preSelectedPatientId={patientId}
            />

            <ConsultationNoteModal
                key={selectedAppointmentId ?? 'new'}
                isOpen={isNoteModalOpen}
                onClose={() => {
                    if (selectedAppointmentId) setDismissedNoteIds(prev => new Set(prev).add(selectedAppointmentId));
                    setIsNoteModalOpen(false);
                    setSelectedAppointmentId(null);
                }}
                patientName={patientName}
                appointmentId={selectedAppointmentId ?? ''}
                patientId={patientId ?? ''}
                existingNotes={existingNotes}
                existingPrescription={existingPrescription}
            />
        </div>
    );
}

export default DoctorPatientDetail;
