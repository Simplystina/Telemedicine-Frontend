import { Link } from "react-router-dom";
import { FiStar, FiClock } from "react-icons/fi";

interface DoctorCardProps {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    imageUrl?: string;
    visitCount?: number; // how many times the patient has seen this doctor
    // Subscription Logic Props
    isSubscribed: boolean;
    freeConsultationsRemaining: number;
    onBook: (id: string) => void;
    onViewProfile: (id: string) => void;
}

function DoctorCard({
    id,
    name,
    specialty,
    rating,
    experience,
    imageUrl,
    visitCount = 0,
    isSubscribed,
    freeConsultationsRemaining,
    onBook,
    onViewProfile,
}: DoctorCardProps) {

    const canBookFree = !isSubscribed && freeConsultationsRemaining > 0;
    const requiresSubscription = !isSubscribed && freeConsultationsRemaining === 0;

    return (
        <div
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            onClick={() => onViewProfile(id)}
        >
            {/* Header Image / Color block */}
            <div className="h-24 bg-primary-50 relative">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-xl border-4 border-white shadow-sm flex items-center justify-center text-xl font-bold text-primary-600 font-poppins shrink-0">
                        {name.charAt(0)}
                    </div>
                )}
                {/* Visit count badge — only shown if patient has visited before */}
                {visitCount > 0 && (
                    <span className="absolute top-3 right-3 text-xs font-bold font-poppins text-primary-700 bg-white px-2.5 py-1 rounded-full shadow-sm border border-primary-100">
                        Visited {visitCount}×
                    </span>
                )}
            </div>

            <div className="p-6 pt-10">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold font-archivo text-neutral-900 group-hover:text-primary-600 transition-colors">Dr. {name}</h3>
                        <p className="text-sm font-poppins text-neutral-500">{specialty}</p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-md text-yellow-700">
                        <FiStar className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold font-poppins">{rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4 mb-5 text-xs font-poppins text-neutral-600">
                    <span className="flex items-center"><FiClock className="mr-1.5" /> {experience} experience</span>
                </div>

                {/* Subscription Context Banner */}
                {canBookFree && (
                    <div className="mb-4 text-xs font-semibold font-poppins text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 flex items-center">
                        <FiStar className="w-3 h-3 mr-1.5 fill-current" />
                        1 Free Consultation Available
                    </div>
                )}

                {/* Action buttons */}
                <div className="mt-auto pt-2 flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewProfile(id); }}
                        className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-poppins font-semibold py-2.5 rounded-lg transition-colors text-sm"
                    >
                        View Profile
                    </button>
                    {requiresSubscription ? (
                        <Link
                            to="/patient/subscription"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-center bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-poppins font-semibold py-2.5 rounded-lg transition-colors text-sm"
                        >
                            Subscribe
                        </Link>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); onBook(id); }}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-poppins font-semibold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
                        >
                            {canBookFree ? "Book Free" : "Book"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorCard;
