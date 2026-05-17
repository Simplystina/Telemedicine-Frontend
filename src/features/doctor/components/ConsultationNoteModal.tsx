import { useState, useEffect } from 'react';
import { FiX, FiFileText, FiActivity, FiTag, FiCheck, FiPlus, FiTrash2, FiEye } from 'react-icons/fi';
import { useCreateNotes, useUpdateNotes } from '@/features/consultations/hooks/useConsultations';
import { useIssuePrescription, useUpdatePrescription } from '@/features/prescriptions/hooks/usePrescriptions';
import { useBulkRequestLabTests } from '@/features/labs/hooks/useLabs';
import FormDatePicker from '@/features/auth/components/FormDatePicker';
import type { ConsultationNotes } from '@/types';

interface PrescriptionRow {
    med: string;
    dose: string;
    unit: string;
    frequency: string;
    duration: string;
}

interface LabOrderRow {
    testName: string;
    recommendedHospital: string;
    instructions: string;
    dateDue: string;
}

interface ConsultationNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
    appointmentId: string;
    patientId: string;
    existingNotes?: ConsultationNotes;
    existingPrescription?: any;
    existingLabOrders?: any[];
}

function ConsultationNoteModal({ isOpen, onClose, patientName, appointmentId, patientId, existingNotes, existingPrescription, existingLabOrders }: ConsultationNoteModalProps) {
    const { mutateAsync: createNotes } = useCreateNotes();
    const { mutateAsync: updateNotes } = useUpdateNotes();
    const { mutateAsync: issuePrescription } = useIssuePrescription();
    const { mutateAsync: updatePrescription } = useUpdatePrescription();
    const { mutateAsync: bulkRequestLabTests } = useBulkRequestLabTests();

    const isEditMode = !!existingNotes;

    const [diagnosis, setDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [patientNote, setPatientNote] = useState('');
    const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([{ med: '', dose: '', unit: '', frequency: '', duration: '' }]);
    const [labOrders, setLabOrders] = useState<LabOrderRow[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (existingNotes) {
            setDiagnosis(existingNotes.diagnosis ?? '');
            setClinicalNotes(existingNotes.clinicalNote ?? '');
            setPatientNote(existingNotes.patientNotes ?? '');

            if (existingPrescription?.medications?.length > 0) {
                setPrescriptions(existingPrescription.medications.map((m: any) => ({
                    med: m.name,
                    dose: m.dosage,
                    unit: m.unit,
                    frequency: m.frequency,
                    duration: m.duration
                })));
            } else {
                setPrescriptions([{ med: '', dose: '', unit: '', frequency: '', duration: '' }]);
            }
        } else {
            setDiagnosis('');
            setClinicalNotes('');
            setPatientNote('');
            setPrescriptions([{ med: '', dose: '', unit: '', frequency: '', duration: '' }]);
        }
        // Always reset new lab orders when modal opens/changes
        setLabOrders([]);
    }, [existingNotes, existingPrescription, isOpen, appointmentId, patientId]);

    if (!isOpen) return null;

    const addPrescription = () => setPrescriptions([...prescriptions, { med: '', dose: '', unit: '', frequency: '', duration: '' }]);
    const removePrescription = (index: number) => setPrescriptions(prescriptions.filter((_, i) => i !== index));

    const addLabOrder = () => setLabOrders([...labOrders, { testName: '', recommendedHospital: '', instructions: '', dateDue: '' }]);
    const updateLabOrder = (index: number, field: keyof LabOrderRow, value: string | Date | null) => {
        const updated = [...labOrders];
        const finalValue = value instanceof Date ? value.toISOString() : value === null ? '' : value;
        updated[index] = { ...updated[index], [field]: finalValue };
        setLabOrders(updated);
    };
    const removeLabOrder = (index: number) => setLabOrders(labOrders.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await updateNotes({ appointmentId, diagnosis, clinicalNote: clinicalNotes, patientNotes: patientNote || undefined });

                const validMeds = prescriptions.filter(p => p.med.trim() && p.dose.trim());
                if (validMeds.length > 0) {
                    const payload = {
                        appointmentId,
                        medications: validMeds.map(p => ({
                            name: p.med,
                            dosage: p.dose,
                            unit: p.unit || 'mg',
                            frequency: p.frequency || 'As directed',
                            duration: p.duration || 'As needed',
                        })),
                    };
                    if (existingPrescription) {
                        await updatePrescription(payload);
                    } else {
                        await issuePrescription(payload);
                    }
                }
            } else {
                await createNotes({ appointmentId, diagnosis, clinicalNote: clinicalNotes, patientNotes: patientNote || undefined });

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

            // Handle New Lab Orders (for both Create and Edit modes)
            const validLabs = labOrders.filter(l => l.testName.trim());
            const isIdValid = (id: any) => id && String(id) !== 'null' && String(id) !== 'undefined' && !isNaN(Number(id)) && Number(id) > 0;

            if (validLabs.length > 0 && isIdValid(patientId) && isIdValid(appointmentId)) {
                await bulkRequestLabTests({
                    patientId: Number(patientId),
                    appointmentId: Number(appointmentId),
                    tests: validLabs
                });
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

                        {/* Prescriptions */}
                        <div className="space-y-4">
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
                        </div>

                        {/* Lab Orders */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-poppins flex items-center">
                                    <FiActivity className="mr-2 text-primary-500" /> Lab Test Requests
                                </label>
                                <button
                                    type="button"
                                    onClick={addLabOrder}
                                    disabled={isSubmitting}
                                    className="text-xs font-bold font-poppins text-primary-600 hover:text-primary-700 flex items-center space-x-1 px-3 py-1 bg-primary-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <FiPlus /> <span>Add Test</span>
                                </button>
                            </div>

                            {/* Existing Lab Results (Read-only) */}
                            {existingLabOrders && existingLabOrders.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase font-poppins">Previously Ordered</p>
                                    <div className="grid gap-2">
                                        {existingLabOrders.map((lab, i) => (
                                            <div key={i} className="p-3 bg-primary-50/30 border border-primary-100 rounded-xl flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-primary-100 flex items-center justify-center text-primary-500">
                                                        <FiActivity className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-neutral-800 font-poppins">{lab.testName}</p>
                                                        <p className="text-[9px] text-neutral-500 font-poppins">Status: <span className="capitalize font-semibold text-primary-600">{lab.status}</span></p>
                                                    </div>
                                                </div>
                                                {lab.status === 'completed' && lab.filePath && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => window.open(lab.filePath, '_blank')}
                                                        className="p-1.5 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                                                    >
                                                        <FiEye className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {labOrders.map((test, index) => (
                                    <div key={index} className="space-y-3 p-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl animate-scale-in relative group">
                                        <button
                                            type="button"
                                            onClick={() => removeLabOrder(index)}
                                            disabled={isSubmitting}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-white text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-neutral-100 rounded-full shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-40"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>

                                        <input
                                            placeholder="Test Name (e.g. Full Blood Count)"
                                            value={test.testName}
                                            onChange={(e) => updateLabOrder(index, 'testName', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                        />
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                placeholder="Recommended Hospital"
                                                value={test.recommendedHospital}
                                                onChange={(e) => updateLabOrder(index, 'recommendedHospital', e.target.value)}
                                                className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                            />
                                            <div className="relative">
                                                <FormDatePicker
                                                    selected={test.dateDue ? new Date(test.dateDue) : null}
                                                    onChange={(date) => updateLabOrder(index, 'dateDue', date)}
                                                    placeholderText="Date Due"
                                                />
                                            </div>
                                        </div>

                                        <textarea
                                            placeholder="Instructions (e.g. Fasting required for 12 hours)"
                                            value={test.instructions}
                                            onChange={(e) => updateLabOrder(index, 'instructions', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm h-20 resize-none transition-all shadow-sm"
                                        />
                                    </div>
                                ))}
                                {labOrders.length === 0 && (!existingLabOrders || existingLabOrders.length === 0) && (
                                    <p className="text-[10px] text-neutral-400 font-poppins italic">No lab tests requested.</p>
                                )}
                            </div>
                        </div>

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

