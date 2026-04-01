import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiMessageSquare, FiCheck } from 'react-icons/fi';

interface Patient {
    id: string;
    name: string;
}

const DUMMY_PATIENTS: Patient[] = [
    { id: '1', name: 'Amaka Chenedu' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Sarah Wilson' },
    { id: '4', name: 'Michael Brown' },
];

interface ScheduleAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    preSelectedPatientId?: string;
}

function ScheduleAppointmentModal({ isOpen, onClose, preSelectedPatientId }: ScheduleAppointmentModalProps) {
    const [selectedPatient, setSelectedPatient] = useState(preSelectedPatientId || '');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('30');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-primary-50">
                    <h2 className="text-xl font-archivo font-bold text-neutral-900">Schedule Custom Consultation</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-neutral-600">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <FiCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-archivo font-bold text-neutral-900">Appointment Scheduled!</h3>
                        <p className="text-neutral-500 font-poppins text-sm italic">The patient has been notified of their upcoming session.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Patient Selection */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-poppins flex items-center">
                                <FiUser className="mr-1.5" /> Select Patient
                            </label>
                            <select
                                required
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                            >
                                <option value="" disabled>Choose a patient...</option>
                                {DUMMY_PATIENTS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date & Time Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-poppins flex items-center">
                                    <FiCalendar className="mr-1.5" /> Date
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-poppins flex items-center">
                                    <FiClock className="mr-1.5" /> Time
                                </label>
                                <input
                                    required
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Duration Options */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-poppins">Consultation Duration</label>
                            <div className="flex p-1 bg-neutral-100 rounded-xl">
                                {['15', '30', '45', '60'].map((min) => (
                                    <button
                                        key={min}
                                        type="button"
                                        onClick={() => setDuration(min)}
                                        className={`flex-1 py-2 rounded-lg font-poppins text-xs font-bold transition-all ${duration === min
                                            ? 'bg-white text-primary-600 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700'
                                            }`}
                                    >
                                        {min}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-poppins flex items-center">
                                <FiMessageSquare className="mr-1.5" /> Internal Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add specific instructions or mention the reason for this follow-up..."
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-poppins text-sm h-24 resize-none transition-all"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-xl font-poppins font-bold text-sm text-neutral-500 hover:bg-neutral-50 border border-transparent transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-2 py-3.5 rounded-xl font-poppins font-bold text-sm bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Create Appointment'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ScheduleAppointmentModal;
