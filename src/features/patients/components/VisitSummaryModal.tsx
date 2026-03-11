import { FiX, FiCalendar, FiClipboard, FiAlertCircle } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";

// --- Types ---
export interface VisitSummary {
    diagnosis: string;
    prescription: string[];
    doctorsAdvice: string;
    followUpDate: string;
    doctorName: string;
    facilityName: string;
    visitDate: string;
    recordTitle: string;
}

interface VisitSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: VisitSummary | null;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins">{label}</span>
            <span className="text-sm text-neutral-800 font-poppins">{value}</span>
        </div>
    );
}

function VisitSummaryModal({ isOpen, onClose, summary }: VisitSummaryModalProps) {
    if (!isOpen || !summary) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-archivo font-bold text-neutral-900">Visit Summary</h2>
                        <p className="text-sm text-neutral-500 font-poppins mt-0.5">{summary.recordTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Doctor & Facility Info */}
                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                            <FaUserDoctor className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold font-archivo text-neutral-900">{summary.doctorName}</p>
                            <p className="text-sm font-poppins text-neutral-500">{summary.facilityName}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-xs font-poppins text-neutral-400">Visit Date</p>
                            <p className="text-sm font-semibold font-poppins text-neutral-700">{summary.visitDate}</p>
                        </div>
                    </div>

                    {/* Notice Banner */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                        <FiAlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-poppins text-amber-800">
                            This is a patient-friendly summary prepared by your doctor. For the full clinical notes, please speak directly with your healthcare provider.
                        </p>
                    </div>

                    {/* Diagnosis */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                <FiClipboard className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold font-archivo text-neutral-900">Diagnosis</h3>
                        </div>
                        <p className="text-sm font-poppins text-neutral-700 bg-neutral-50 rounded-xl p-4 border border-neutral-100 leading-relaxed">
                            {summary.diagnosis}
                        </p>
                    </div>

                    {/* Prescription */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                <FiClipboard className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold font-archivo text-neutral-900">Prescription</h3>
                        </div>
                        <ul className="space-y-2">
                            {summary.prescription.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-sm font-poppins text-neutral-700 bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-bold text-xs flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Divider */}
                    <hr className="border-neutral-100" />

                    {/* Doctor's Advice & Follow-up */}
                    <div className="grid grid-cols-1 gap-4">
                        <SummaryRow label="Doctor's Advice" value={summary.doctorsAdvice} />
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                            <FiCalendar className="w-5 h-5 text-green-600 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold font-poppins text-green-800 uppercase tracking-wider">Follow-up Date</p>
                                <p className="text-sm font-bold font-poppins text-green-900">{summary.followUpDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 bg-neutral-50 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-poppins font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VisitSummaryModal;
