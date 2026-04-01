import { useState } from 'react';
import { FiClock, FiUser, FiArrowRight, FiCheckCircle, FiAlertCircle, FiFileText, FiPlus } from 'react-icons/fi';
import ConsultationNoteModal from '../components/ConsultationNoteModal';

const PENDING_RECORDS = [
    { id: 'app1', date: 'Today, 10:30 AM', patient: 'Jane Doe', type: 'Follow-up', duration: '15m' },
    { id: 'app2', date: 'Yesterday, 2:15 PM', patient: 'Emeka Eze', type: 'Routine Check', duration: '30m' },
    { id: 'app3', date: 'Mar 28, 2026', patient: 'Aisha Bello', type: 'Initial Consultation', duration: '45m' },
];

function DoctorPendingNotes() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState('');

    const handleOpenModal = (patientName: string) => {
        setSelectedPatient(patientName);
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
                <div className="flex items-center space-x-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                    <FiAlertCircle className="text-amber-600 w-5 h-5 animate-pulse" />
                    <div>
                        <p className="text-amber-900 font-bold text-xs font-poppins">3 Pending Records</p>
                        <p className="text-amber-700 text-[10px] font-poppins">Action required to finalize billing</p>
                    </div>
                </div>
            </div>

            {/* Tabs / Filter Row */}
            <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-2xl w-fit">
                <button className="px-6 py-2 bg-white rounded-xl shadow-sm border border-neutral-200 text-sm font-bold font-poppins text-primary-600 transition-all">
                    Pending (3)
                </button>
                <button className="px-6 py-2 text-neutral-500 rounded-xl text-sm font-bold font-poppins hover:bg-neutral-50 transition-all">
                    Completed
                </button>
            </div>

            {/* Records List */}
            <div className="grid gap-4">
                {PENDING_RECORDS.map((record) => (
                    <div 
                        key={record.id}
                        className="group bg-white rounded-4xl border border-neutral-200 p-6 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-100 animate-fade-in"
                    >
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all shadow-inner">
                                <FiFileText className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <h3 className="text-lg font-archivo font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                                        {record.patient}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-bold font-poppins uppercase tracking-wider">
                                        {record.type}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm font-poppins text-neutral-500">
                                    <div className="flex items-center">
                                        <FiClock className="mr-1.5 w-3.5 h-3.5" />
                                        {record.date} ({record.duration})
                                    </div>
                                    <div className="flex items-center">
                                        <FiUser className="mr-1.5 w-3.5 h-3.5" />
                                        Patient ID: #PAT-{record.id.slice(-2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 self-end md:self-auto">
                            <button className="p-3 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="View Patient Details">
                                <FiArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => handleOpenModal(record.patient)}
                                className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-poppins font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center space-x-2"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Fill Clinical Note</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Instructions Card */}
            <div className="bg-primary-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-primary-500/20 animate-fade-in-up">
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
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/10 rounded-full -ml-20 -mb-20 blur-2xl" />
            </div>

            <ConsultationNoteModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patientName={selectedPatient}
            />
        </div>
    );
}

export default DoctorPendingNotes;
