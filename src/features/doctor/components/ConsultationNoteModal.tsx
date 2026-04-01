import { useState } from 'react';
import { FiX, FiFileText, FiActivity, FiTag, FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi';

interface ConsultationNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
}

function ConsultationNoteModal({ isOpen, onClose, patientName }: ConsultationNoteModalProps) {
    const [diagnosis, setDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState([{ med: '', dose: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const addPrescription = () => setPrescriptions([...prescriptions, { med: '', dose: '' }]);
    const removePrescription = (index: number) => setPrescriptions(prescriptions.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in border border-neutral-100">
                {/* Header */}
                <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-primary-50/50">
                    <div>
                        <h2 className="text-2xl font-archivo font-bold text-neutral-900">Consultation Record</h2>
                        <p className="text-neutral-500 font-poppins text-xs mt-1">Patient: <span className="font-bold text-primary-600">{patientName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-neutral-600 shadow-sm border border-transparent hover:border-neutral-100">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            <FiCheck className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-archivo font-bold text-neutral-900">Record Saved Successfully</h3>
                        <p className="text-neutral-500 font-poppins text-sm max-w-xs">The medical record has been updated and the patient has been notified.</p>
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

                        {/* Prescriptions */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-poppins flex items-center">
                                    <FiActivity className="mr-2 text-primary-500" /> Prescriptions
                                </label>
                                <button
                                    type="button"
                                    onClick={addPrescription}
                                    className="text-xs font-bold font-poppins text-primary-600 hover:text-primary-700 flex items-center space-x-1 px-3 py-1 bg-primary-50 rounded-lg transition-colors"
                                >
                                    <FiPlus /> <span>Add Med</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {prescriptions.map((p, index) => (
                                    <div key={index} className="flex gap-3 animate-scale-in">
                                        <input
                                            required
                                            placeholder="Medication Name"
                                            value={p.med}
                                            onChange={(e) => {
                                                const newRx = [...prescriptions];
                                                newRx[index].med = e.target.value;
                                                setPrescriptions(newRx);
                                            }}
                                            className="flex-2 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                        />
                                        <input
                                            required
                                            placeholder="Dosage (e.g. 10mg daily)"
                                            value={p.dose}
                                            onChange={(e) => {
                                                const newRx = [...prescriptions];
                                                newRx[index].dose = e.target.value;
                                                setPrescriptions(newRx);
                                            }}
                                            className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                        />
                                        {prescriptions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePrescription(index)}
                                                className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4 pt-4 border-t border-neutral-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 rounded-2xl font-poppins font-bold text-sm text-neutral-500 hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200"
                            >
                                Discard Draft
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-2 py-4 rounded-2xl font-poppins font-bold text-sm bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <FiCheck className="w-5 h-5" />
                                        <span>Seal Record & Notify Patient</span>
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
