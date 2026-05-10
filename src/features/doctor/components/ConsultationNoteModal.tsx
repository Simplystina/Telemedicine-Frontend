import { useState, useEffect } from 'react';
import { FiX, FiFileText, FiActivity, FiTag, FiCheck, FiPlus, FiTrash2, FiEye } from 'react-icons/fi';
import { useCreateNotes, useUpdateNotes } from '@/features/consultations/hooks/useConsultations';
import { useIssuePrescription } from '@/features/prescriptions/hooks/usePrescriptions';
import type { ConsultationNotes } from '@/types';

interface PrescriptionRow {
    med: string;
    dose: string;
    unit: string;
    frequency: string;
    duration: string;
}

interface ConsultationNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
    appointmentId: string;
    existingNotes?: ConsultationNotes;
}

function ConsultationNoteModal({ isOpen, onClose, patientName, appointmentId, existingNotes }: ConsultationNoteModalProps) {
    const { mutateAsync: createNotes } = useCreateNotes();
    const { mutateAsync: updateNotes } = useUpdateNotes();
    const { mutateAsync: issuePrescription } = useIssuePrescription();

    const isEditMode = !!existingNotes;

    const [diagnosis, setDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [patientNote, setPatientNote] = useState('');
    const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([{ med: '', dose: '', unit: '', frequency: '', duration: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (existingNotes) {
            setDiagnosis(existingNotes.diagnosis ?? '');
            setClinicalNotes(existingNotes.notes ?? '');
            setPatientNote(existingNotes.symptoms ?? '');
        } else {
            setDiagnosis('');
            setClinicalNotes('');
            setPatientNote('');
            setPrescriptions([{ med: '', dose: '', unit: '', frequency: '', duration: '' }]);
        }
    }, [existingNotes, isOpen]);

    if (!isOpen) return null;

    const addPrescription = () => setPrescriptions([...prescriptions, { med: '', dose: '', unit: '', frequency: '', duration: '' }]);
    const removePrescription = (index: number) => setPrescriptions(prescriptions.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await updateNotes({ appointmentId, diagnosis, notes: clinicalNotes, symptoms: patientNote || undefined });
            } else {
                await createNotes({ appointmentId, diagnosis, notes: clinicalNotes, symptoms: patientNote || undefined });

                const validMeds = prescriptions.filter(p => p.med.trim() && p.dose.trim());
                if (validMeds.length > 0) {
                    await issuePrescription({
                        appointmentId,
                        medications: validMeds.map(p => ({
                            name: p.med,
                            dosage: p.dose,
                            unit: p.unit || 'mg',
                            frequency: p.frequency || 'As directed',
                            duration: p.duration || 'As needed',
                        })),
                    });
                }
            }

            setIsSuccess(true);
            setTimeout(() => { setIsSuccess(false); onClose(); }, 1500);
        } catch {
            // Errors shown via toast from hooks
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in border border-neutral-100">
                {/* Header */}
                <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-primary-50/50">
                    <div>
                        <h2 className="text-2xl font-archivo font-bold text-neutral-900">{isEditMode ? 'Edit Consultation Record' : 'Consultation Record'}</h2>
                        <p className="text-neutral-500 font-poppins text-xs mt-1">Patient: <span className="font-bold text-primary-600">{patientName}</span></p>
                    </div>
                    <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-neutral-600 shadow-sm border border-transparent hover:border-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            <FiCheck className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-archivo font-bold text-neutral-900">{isEditMode ? 'Record Updated' : 'Record Saved Successfully'}</h3>
                        <p className="text-neutral-500 font-poppins text-sm max-w-xs">{isEditMode ? 'The consultation notes have been updated.' : 'The medical record has been updated and the patient has been notified.'}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Diagnosis */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-poppins flex items-center">
                                <FiTag className="mr-2 text-primary-500" /> Primary Diagnosis
                            </label>
                            <input
                                required
                                type="text"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="e.g. Primary Hypertension, Seasonal Allergies..."
                                className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-poppins text-sm transition-all shadow-sm"
                            />
                        </div>

                        {/* Clinical Notes */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-poppins flex items-center">
                                <FiFileText className="mr-2 text-primary-500" /> Clinical Notes & Observations
                            </label>
                            <textarea
                                required
                                value={clinicalNotes}
                                onChange={(e) => setClinicalNotes(e.target.value)}
                                placeholder="Describe symptoms, patient history discussed, and recommended lifestyle changes..."
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-poppins text-sm h-32 resize-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Note to Patient */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-poppins flex items-center">
                                    <FiFileText className="mr-2 text-primary-500" /> Note to Patient
                                    <span className="ml-2 text-neutral-400 normal-case tracking-normal font-normal">(Optional)</span>
                                </label>
                                <span className="flex items-center gap-1 text-[10px] font-semibold font-poppins text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                    <FiEye className="w-3 h-3" /> Visible to patient
                                </span>
                            </div>
                            <textarea
                                value={patientNote}
                                onChange={(e) => setPatientNote(e.target.value)}
                                placeholder="A brief message the patient will see, e.g. 'Rest and stay hydrated. Follow up in 2 weeks.'"
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-poppins text-sm h-24 resize-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Prescriptions — create mode only */}
                        {!isEditMode && <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-poppins flex items-center">
                                    <FiActivity className="mr-2 text-primary-500" /> Prescriptions
                                </label>
                                <button
                                    type="button"
                                    onClick={addPrescription}
                                    disabled={isSubmitting}
                                    className="text-xs font-bold font-poppins text-primary-600 hover:text-primary-700 flex items-center space-x-1 px-3 py-1 bg-primary-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <FiPlus /> <span>Add Med</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {prescriptions.map((p, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2 animate-scale-in">
                                        <input
                                            placeholder="Medication Name"
                                            value={p.med}
                                            onChange={(e) => {
                                                const updated = [...prescriptions];
                                                updated[index].med = e.target.value;
                                                setPrescriptions(updated);
                                            }}
                                            className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                        />
                                        <input
                                            placeholder="Dosage (e.g. 500)"
                                            value={p.dose}
                                            onChange={(e) => {
                                                const updated = [...prescriptions];
                                                updated[index].dose = e.target.value;
                                                setPrescriptions(updated);
                                            }}
                                            className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                        />
                                        <input
                                            placeholder="Unit (e.g. mg, ml, tablet)"
                                            value={p.unit}
                                            onChange={(e) => {
                                                const updated = [...prescriptions];
                                                updated[index].unit = e.target.value;
                                                setPrescriptions(updated);
                                            }}
                                            className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                        />
                                        <input
                                            placeholder="Frequency (e.g. Twice daily)"
                                            value={p.frequency}
                                            onChange={(e) => {
                                                const updated = [...prescriptions];
                                                updated[index].frequency = e.target.value;
                                                setPrescriptions(updated);
                                            }}
                                            className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Duration (e.g. 7 days)"
                                                value={p.duration}
                                                onChange={(e) => {
                                                    const updated = [...prescriptions];
                                                    updated[index].duration = e.target.value;
                                                    setPrescriptions(updated);
                                                }}
                                                className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                            />
                                            {prescriptions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removePrescription(index)}
                                                    disabled={isSubmitting}
                                                    className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}

                        {/* Actions */}
                        <div className="flex space-x-4 pt-4 border-t border-neutral-100">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 py-4 rounded-2xl font-poppins font-bold text-sm text-neutral-500 hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Discard Draft
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-2 py-4 rounded-2xl font-poppins font-bold text-sm bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="w-5 h-5" />
                                        <span>{isEditMode ? 'Save Changes' : 'Seal Record & Notify Patient'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ConsultationNoteModal;
