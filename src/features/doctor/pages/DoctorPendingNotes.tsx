import { useState } from 'react';
import { FiClock, FiUser, FiArrowRight, FiCheckCircle, FiAlertCircle, FiFileText, FiPlus, FiCalendar, FiEdit2 } from 'react-icons/fi';
import { useQueries } from '@tanstack/react-query';
import ConsultationNoteModal from '../components/ConsultationNoteModal';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { useConsultationNotes } from '@/features/consultations/hooks/useConsultations';
import { consultationApi } from '@/features/consultations/api/consultationApi';
import type { Appointment, ConsultationNotes } from '@/types';

function formatAppointmentDate(dateStr: string, startTime: string): string {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const [h, m] = startTime.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const timeStr = `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;

    if (dateStr === today) return `Today, ${timeStr}`;
    if (dateStr === yesterday) return `Yesterday, ${timeStr}`;
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    }) + `, ${timeStr}`;
}

function calcDuration(start: string, end: string): string {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    return mins > 0 ? `${mins}m` : '';
}

function getPatientName(appt: Appointment): string {
    const parts = [appt.patient?.firstName, appt.patient?.lastName].filter(Boolean);
    return parts.join(' ') || 'Unknown Patient';
}

type ViewTab = 'pending' | 'all';

function RecordCard({ appt, onFill, onEdit }: {
    appt: Appointment;
    onFill: (patientName: string, appointmentId: string) => void;
    onEdit: (patientName: string, appointmentId: string, notes: ConsultationNotes) => void;
}) {
    const { data: existingNotes, isLoading: notesLoading } = useConsultationNotes(appt.id);
    const patientName = getPatientName(appt);
    const dateLabel = formatAppointmentDate(appt.date, appt.startTime);
    const duration = calcDuration(appt.startTime, appt.endTime);

    return (
        <div className="group bg-white rounded-4xl border border-neutral-200 p-6 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-100">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all shadow-inner">
                    <FiFileText className="w-6 h-6" />
                </div>
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-archivo font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {patientName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-bold font-poppins uppercase tracking-wider">
                            {appt.type}
                        </span>
                        {appt.status !== 'completed' && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold font-poppins uppercase tracking-wider">
                                {appt.status}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm font-poppins text-neutral-500">
                        <div className="flex items-center">
                            <FiClock className="mr-1.5 w-3.5 h-3.5" />
                            {dateLabel}{duration ? ` (${duration})` : ''}
                        </div>
                        {appt.patient?.id && (
                            <div className="flex items-center">
                                <FiUser className="mr-1.5 w-3.5 h-3.5" />
                                {appt.patient.id.slice(0, 8)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-auto">
                <button className="p-3 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="View Patient Details">
                    <FiArrowRight className="w-5 h-5" />
                </button>
                {appt.status === 'completed' && (
                    notesLoading ? (
                        <button disabled className="px-6 py-3 rounded-2xl border border-neutral-200 text-neutral-400 font-poppins font-bold text-sm flex items-center space-x-2 cursor-not-allowed opacity-60">
                            <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin" />
                            <span>Checking...</span>
                        </button>
                    ) : existingNotes ? (
                        <button
                            onClick={() => onEdit(patientName, appt.id, existingNotes)}
                            className="px-6 py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-2xl font-poppins font-bold text-sm hover:bg-primary-50 transition-all flex items-center space-x-2"
                        >
                            <FiEdit2 className="w-4 h-4" />
                            <span>Edit Note</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => onFill(patientName, appt.id)}
                            className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-poppins font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center space-x-2"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Fill Clinical Note</span>
                        </button>
                    )
                )}
            </div>
        </div>
    );
}

function DoctorPendingNotes() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
    const [selectedNotes, setSelectedNotes] = useState<ConsultationNotes | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<ViewTab>('pending');

    const { data, isLoading } = useAppointments();
    const completedAppointments = (data?.appointments ?? [])
        .filter(a => a.status === 'completed')
        .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));

    // Batch-fetch notes for all completed appointments to derive the true pending count.
    // Shares query keys with RecordCard's useConsultationNotes .
    const notesResults = useQueries({
        queries: completedAppointments.map(appt => ({
            queryKey: ['consultation-notes', appt.id],
            queryFn: () => consultationApi.getNotes(appt.id),
            enabled: !!appt.id,
        })),
    });

    const notesLoading = notesResults.some(r => r.isLoading);
    const unfiled = completedAppointments.filter((_, i) => !notesResults[i]?.data);
    const pendingCount = unfiled.length;

    const displayed = activeTab === 'pending' ? unfiled : completedAppointments;

    const handleFill = (patientName: string, appointmentId: string) => {
        setSelectedNotes(undefined);
        setSelectedPatient(patientName);
        setSelectedAppointmentId(appointmentId);
        setIsModalOpen(true);
    };

    const handleEdit = (patientName: string, appointmentId: string, notes: ConsultationNotes) => {
        setSelectedNotes(notes);
        setSelectedPatient(patientName);
        setSelectedAppointmentId(appointmentId);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-archivo font-bold text-neutral-900">Clinical Records</h1>
                    <p className="text-neutral-500 font-poppins text-sm mt-1">Manage and complete documentation for your recent consultations.</p>
                </div>
                {!isLoading && pendingCount > 0 && (
                    <div className="flex items-center space-x-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                        <FiAlertCircle className="text-amber-600 w-5 h-5 animate-pulse" />
                        <div>
                            <p className="text-amber-900 font-bold text-xs font-poppins">{pendingCount} Pending Record{pendingCount !== 1 ? 's' : ''}</p>
                            <p className="text-amber-700 text-[10px] font-poppins">Action required to finalize billing</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold font-poppins transition-all ${activeTab === 'pending'
                        ? 'bg-white shadow-sm border border-neutral-200 text-primary-600'
                        : 'text-neutral-500 hover:bg-neutral-50'
                        }`}
                >
                    Pending ({isLoading ? '…' : pendingCount})
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold font-poppins transition-all ${activeTab === 'all'
                        ? 'bg-white shadow-sm border border-neutral-200 text-primary-600'
                        : 'text-neutral-500 hover:bg-neutral-50'
                        }`}
                >
                    All Consultations
                </button>
            </div>

            {/* Records List */}
            <div className="grid gap-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-4xl border border-neutral-200 p-6 h-24 animate-pulse" />
                    ))
                ) : displayed.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                        <FiCalendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <p className="font-poppins text-neutral-500 text-sm">
                            {activeTab === 'pending'
                                ? 'No completed appointments needing documentation.'
                                : 'No appointments found.'}
                        </p>
                    </div>
                ) : displayed.map((appt) => (
                    <RecordCard key={appt.id} appt={appt} onFill={handleFill} onEdit={handleEdit} />
                ))}
            </div>

            {/* Policy Card */}
            <div className="bg-primary-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary-500/20">
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-2xl font-archivo font-bold mb-4 flex items-center">
                        <FiCheckCircle className="mr-3 text-primary-200" /> Complete Records Policy
                    </h2>
                    <p className="text-primary-100 font-poppins text-sm leading-relaxed mb-6">
                        Documentation should be completed within 24 hours of the consultation. This ensures that the patient's treatment history is accurate and always available to any doctor seeing the patient across our network.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                            <p className="text-xl font-bold font-archivo">92%</p>
                            <p className="text-primary-200 text-[10px] font-bold uppercase tracking-wider">Compliance Rate</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                            <p className="text-xl font-bold font-archivo">2.4h</p>
                            <p className="text-primary-200 text-[10px] font-bold uppercase tracking-wider">Avg. Completion Time</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/10 rounded-full -ml-20 -mb-20 blur-2xl" />
            </div>

            <ConsultationNoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patientName={selectedPatient}
                appointmentId={selectedAppointmentId}
                existingNotes={selectedNotes}
            />
        </div>
    );
}

export default DoctorPendingNotes;
