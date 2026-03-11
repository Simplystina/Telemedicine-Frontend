import { FiX, FiStar, FiClock, FiCalendar, FiVideo } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";

// ---- Types ----
export interface DoctorProfile {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    imageUrl?: string;
    bio?: string;
    qualifications?: string[];
    languages?: string[];
    hospital?: string;
}

export interface PastVisit {
    date: string;
    reason: string;
    status: "Completed" | "Cancelled";
}

interface DoctorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: DoctorProfile | null;
    pastVisits?: PastVisit[];
    onBook: () => void;
}

function DoctorProfileModal({ isOpen, onClose, doctor, pastVisits = [], onBook }: DoctorProfileModalProps) {
    if (!isOpen || !doctor) return null;

    const visitCount = pastVisits.filter(v => v.status === "Completed").length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Hero / Header */}
                <div className="relative h-32 bg-linear-to-br from-primary-500 to-primary-700 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                    {/* Avatar */}
                    <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-primary-100 flex items-center justify-center">
                        {doctor.imageUrl ? (
                            <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                        ) : (
                            <FaUserDoctor className="w-10 h-10 text-primary-500" />
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pt-14 pb-6 overflow-y-auto flex-1 space-y-6">

                    {/* Doctor Name + Stats */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-archivo font-bold text-neutral-900">Dr. {doctor.name}</h2>
                            <p className="text-sm font-poppins text-neutral-500 mt-0.5">{doctor.specialty}</p>
                            {doctor.hospital && (
                                <p className="text-xs font-poppins text-neutral-400 mt-1">{doctor.hospital}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 shrink-0">
                            <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-bold font-poppins text-yellow-700">{doctor.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 divide-x divide-neutral-100 bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
                        <div className="p-4 text-center">
                            <FiClock className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                            <p className="text-xs font-poppins text-neutral-500">Experience</p>
                            <p className="text-sm font-bold font-archivo text-neutral-900">{doctor.experience}</p>
                        </div>
                        <div className="p-4 text-center">
                            <FiCalendar className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                            <p className="text-xs font-poppins text-neutral-500">Your Visits</p>
                            <p className="text-sm font-bold font-archivo text-neutral-900">
                                {visitCount > 0 ? `${visitCount}×` : "—"}
                            </p>
                        </div>
                        <div className="p-4 text-center">
                            <FiStar className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                            <p className="text-xs font-poppins text-neutral-500">Rating</p>
                            <p className="text-sm font-bold font-archivo text-neutral-900">{doctor.rating.toFixed(1)}/5</p>
                        </div>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                        <div>
                            <h3 className="text-sm font-bold font-archivo text-neutral-800 mb-2">About</h3>
                            <p className="text-sm font-poppins text-neutral-600 leading-relaxed">{doctor.bio}</p>
                        </div>
                    )}

                    {/* Qualifications & Languages */}
                    <div className="grid grid-cols-2 gap-4">
                        {doctor.qualifications && doctor.qualifications.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold font-archivo text-neutral-800 mb-2">Qualifications</h3>
                                <ul className="space-y-1">
                                    {doctor.qualifications.map((q, i) => (
                                        <li key={i} className="text-xs font-poppins text-neutral-600 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" />
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {doctor.languages && doctor.languages.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold font-archivo text-neutral-800 mb-2">Languages</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {doctor.languages.map((lang, i) => (
                                        <span key={i} className="text-xs font-poppins px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Visit History */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold font-archivo text-neutral-800">Your History with Dr. {doctor.name.split(" ").pop()}</h3>
                            {visitCount > 0 && (
                                <span className="text-xs font-semibold font-poppins text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                                    {visitCount} visit{visitCount > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                        {pastVisits.length > 0 ? (
                            <div className="space-y-2">
                                {pastVisits.map((visit, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <div>
                                            <p className="text-sm font-semibold font-poppins text-neutral-800">{visit.reason}</p>
                                            <p className="text-xs font-poppins text-neutral-500 mt-0.5 flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" /> {visit.date}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-bold font-poppins px-2.5 py-1 rounded-full ${visit.status === "Completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-neutral-200 text-neutral-500"
                                            }`}>
                                            {visit.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                <p className="text-sm font-poppins text-neutral-400">You haven't visited Dr. {doctor.name.split(" ").pop()} yet.</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer CTA */}
                <div className="p-6 border-t border-neutral-100 bg-neutral-50 shrink-0 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-poppins font-semibold hover:bg-neutral-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => { onClose(); onBook(); }}
                        className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-xl font-poppins font-semibold hover:bg-primary-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <FiVideo className="w-4 h-4" />
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfileModal;
