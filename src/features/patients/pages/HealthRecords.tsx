import { useState } from "react";
import {
    FiDownload, FiEye, FiFileText, FiSearch,
    FiFilePlus, FiX, FiCalendar, FiAlertCircle, FiActivity
} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import UploadDocumentModal from "../components/UploadDocumentModal";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { usePrescriptions } from "@/features/prescriptions/hooks/usePrescriptions";
import { useConsultationNotes } from "@/features/consultations/hooks/useConsultations";
import { useLabResults } from "@/features/labs/hooks/useLabs";
import type { Appointment, Prescription } from "@/types";

type RecordType = "visit-note" | "prescription";

interface RecordItem {
    id: string;
    date: string;
    rawDate: string;
    title: string;
    type: RecordType;
    doctorName: string;
    appointmentId: string;
    prescription?: Prescription;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function getDoctorName(appt: Appointment): string {
    const parts = [appt.doctor?.firstName, appt.doctor?.lastName].filter(Boolean);
    const n = parts.join(" ") || "Doctor";
    return n.startsWith("Dr.") ? n : `Dr. ${n}`;
}

// ── Record Detail Modal ────────────────────────────────────────────────────────

function NoteDetailModal({ appointmentId, doctorName, visitDate, onClose }: {
    appointmentId: string;
    doctorName: string;
    visitDate: string;
    onClose: () => void;
}) {
    const { data: notes, isLoading: notesLoading } = useConsultationNotes(appointmentId);
    const { data: labResults = [], isLoading: labsLoading } = useLabResults();

    const isLoading = notesLoading || labsLoading;
    const associatedLabs = labResults.filter(l => String(l.appointmentId) === String(appointmentId));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                    <div>
                        <h2 className="text-xl font-archivo font-bold text-neutral-900">Visit Summary</h2>
                        <p className="text-sm text-neutral-500 font-poppins mt-0.5">{visitDate}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                            <FaUserDoctor className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold font-archivo text-neutral-900">{doctorName}</p>
                            <p className="text-sm font-poppins text-neutral-500">Telemedicine Consultation</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-xs font-poppins text-neutral-400">Visit Date</p>
                            <p className="text-sm font-semibold font-poppins text-neutral-700">{visitDate}</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-neutral-100 animate-pulse" />)}
                        </div>
                    ) : !notes && associatedLabs.length === 0 ? (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                            <FiAlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-poppins text-amber-800">
                                No clinical notes found for this visit.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {notes?.patientNotes && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-2">Doctor's Note to You</p>
                                    <p className="text-sm font-poppins text-neutral-700 bg-neutral-50 rounded-xl p-4 border border-neutral-100 leading-relaxed">{notes.patientNotes}</p>
                                </div>
                            )}

                            {associatedLabs.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-2 flex items-center">
                                        <FiActivity className="mr-2 text-primary-500" /> Associated Lab Requests
                                    </p>
                                    <div className="space-y-2">
                                        {associatedLabs.map(lab => (
                                            <div key={lab.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-primary-500">
                                                        <FiActivity className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-neutral-800 font-poppins">{lab.testName}</p>
                                                        <p className="text-[10px] text-neutral-500 font-poppins">Status: <span className="capitalize font-semibold">{lab.status}</span></p>
                                                    </div>
                                                </div>
                                                {lab.status === 'completed' && lab.filePath && (
                                                    <button 
                                                        onClick={() => window.open(lab.filePath, '_blank')}
                                                        className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="View Result"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {notes?.followUpDate && (
                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                                    <FiCalendar className="w-5 h-5 text-green-600 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold font-poppins text-green-800 uppercase tracking-wider">Follow-up Date</p>
                                        <p className="text-sm font-bold font-poppins text-green-900">
                                            {formatDate(notes.followUpDate)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-neutral-100 bg-neutral-50">
                    <button onClick={onClose} className="w-full py-3 px-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-poppins font-semibold hover:bg-neutral-100 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function PrescriptionDetailModal({ prescription, doctorName, onClose }: {
    prescription: Prescription;
    doctorName: string;
    onClose: () => void;
}) {
    const issuedDate = new Date(prescription.issuedAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                    <div>
                        <h2 className="text-xl font-archivo font-bold text-neutral-900">Prescription</h2>
                        <p className="text-sm text-neutral-500 font-poppins mt-0.5">Issued {issuedDate}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                            <FaUserDoctor className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold font-archivo text-neutral-900">{doctorName}</p>
                            <p className="text-sm font-poppins text-neutral-500">Prescribing Doctor</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-3">Medications</p>
                        <div className="space-y-3">
                            {prescription.medications.map((med, i) => {
                                const dosageStr = `${med.dosage}${med.unit ? med.unit : ''}`;
                                const sentence = `Take ${dosageStr}, ${med.frequency}, for ${med.duration}.`;
                                return (
                                    <div key={i} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl shrink-0">💊</span>
                                            <div>
                                                <p className="font-bold font-poppins text-neutral-900">
                                                    {med.name}{med.unit ? ` (${med.unit})` : ''}
                                                </p>
                                                <p className="text-sm font-poppins text-neutral-600 mt-0.5">{sentence}</p>
                                                {med.instructions && (
                                                    <p className="text-xs font-poppins text-neutral-500 mt-1 italic">{med.instructions}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {prescription.notes && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-1.5">Notes</p>
                            <p className="text-sm font-poppins text-neutral-700 bg-neutral-50 rounded-xl p-4 border border-neutral-100 leading-relaxed">{prescription.notes}</p>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-neutral-100 bg-neutral-50">
                    <button onClick={onClose} className="w-full py-3 px-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-poppins font-semibold hover:bg-neutral-100 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Visit Note Row (fetches own notes status) ─────────────────────────────────

function VisitNoteRow({ record, onView }: {
    record: RecordItem;
    onView: () => void;
}) {
    const { data: notes, isLoading } = useConsultationNotes(record.appointmentId);
    const hasFilled = !isLoading && !!notes;

    return (
        <tr className="hover:bg-neutral-50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{record.date}</td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <FiFileText className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {record.title}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isLoading ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-400">
                        <div className="w-2.5 h-2.5 border border-neutral-300 border-t-neutral-500 rounded-full animate-spin" />
                        Loading
                    </span>
                ) : hasFilled ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                        Visit Note
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700">
                        <FiAlertCircle className="w-3 h-3" /> Pending
                    </span>
                )}
            </td>
            <td className="px-6 py-4 text-sm text-neutral-600">{record.doctorName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onView}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View details"
                    >
                        <FiEye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Download">
                        <FiDownload className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

function HealthRecords() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<{ appointmentId: string; doctorName: string; visitDate: string } | null>(null);
    const [selectedPrescription, setSelectedPrescription] = useState<{ prescription: Prescription; doctorName: string } | null>(null);

    const { data: apptData, isLoading: apptLoading } = useAppointments();
    const { data: prescriptions = [], isLoading: rxLoading } = usePrescriptions();

    const isLoading = apptLoading || rxLoading;

    const completedAppointments = (apptData?.appointments ?? []).filter(a => a.status === "completed");

    const visitNoteRecords: RecordItem[] = completedAppointments.map(appt => ({
        id: `note-${appt.id}`,
        date: formatDate(appt.date),
        rawDate: appt.date,
        title: appt.reason ? `Visit: ${appt.reason}` : `Consultation with ${getDoctorName(appt)}`,
        type: "visit-note",
        doctorName: getDoctorName(appt),
        appointmentId: appt.id,
    }));

    const prescriptionRecords: RecordItem[] = prescriptions.map(rx => {
        const medTitle = rx.medications.length === 1
            ? rx.medications[0].name
            : `${rx.medications[0].name} + ${rx.medications.length - 1} more`;
        const appt = (apptData?.appointments ?? []).find(a => a.id === rx.appointmentId);
        const doctorName = appt ? getDoctorName(appt) : "Doctor";
        return {
            id: `rx-${rx.id}`,
            date: new Date(rx.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            rawDate: rx.issuedAt.slice(0, 10),
            title: `Prescription: ${medTitle}`,
            type: "prescription",
            doctorName,
            appointmentId: rx.appointmentId,
            prescription: rx,
        };
    });

    const allRecords: RecordItem[] = [...visitNoteRecords, ...prescriptionRecords]
        .sort((a, b) => b.rawDate.localeCompare(a.rawDate));

    const filteredRecords = allRecords.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const typeLabel: Record<RecordType, string> = {
        "visit-note": "Visit Note",
        "prescription": "Prescription",
    };

    const typeBadgeClass: Record<RecordType, string> = {
        "visit-note": "bg-blue-50 text-blue-700",
        "prescription": "bg-purple-50 text-purple-700",
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Health Records</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        Securely view and manage your visit summaries, notes, and prescriptions.
                    </p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center justify-center shrink-0 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors shadow-sm"
                >
                    <FiFilePlus className="mr-2" /> Upload Record
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FaUserDoctor className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-poppins text-neutral-500">Visit Notes</p>
                        <p className="text-2xl font-archivo font-bold text-neutral-900">
                            {isLoading ? "—" : visitNoteRecords.length}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <FiFileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-poppins text-neutral-500">Prescriptions</p>
                        <p className="text-2xl font-archivo font-bold text-neutral-900">
                            {isLoading ? "—" : prescriptions.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Records List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by title, doctor, or type..."
                            className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-poppins min-w-175">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Record</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Doctor</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-8 rounded-lg bg-neutral-100 animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-neutral-400">
                                            <FiFileText className="w-12 h-12 mb-3 text-neutral-300" />
                                            <p className="text-sm">No records found{searchTerm ? " matching your search" : ". Complete a consultation to see your records"}.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRecords.map((record) => (
                                record.type === "visit-note" ? (
                                    <VisitNoteRow
                                        key={record.id}
                                        record={record}
                                        onView={() => setSelectedNote({ appointmentId: record.appointmentId, doctorName: record.doctorName, visitDate: record.date })}
                                    />
                                ) : (
                                    <tr key={record.id} className="hover:bg-neutral-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{record.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                                    <FiFileText className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                                                    {record.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${typeBadgeClass[record.type]}`}>
                                                {typeLabel[record.type]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600">{record.doctorName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => record.prescription && setSelectedPrescription({ prescription: record.prescription, doctorName: record.doctorName })}
                                                    className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title="View details"
                                                >
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Download">
                                                    <FiDownload className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {selectedNote && (
                <NoteDetailModal
                    appointmentId={selectedNote.appointmentId}
                    doctorName={selectedNote.doctorName}
                    visitDate={selectedNote.visitDate}
                    onClose={() => setSelectedNote(null)}
                />
            )}
            {selectedPrescription && (
                <PrescriptionDetailModal
                    prescription={selectedPrescription.prescription}
                    doctorName={selectedPrescription.doctorName}
                    onClose={() => setSelectedPrescription(null)}
                />
            )}
            <UploadDocumentModal
                isOpen={isUploadOpen}
                onClose={() => {
                    setIsUploadOpen(false);
                }}
            />
        </div>
    );
}

export default HealthRecords;
