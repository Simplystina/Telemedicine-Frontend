import { useState, useEffect } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import DoctorCard from "@features/patients/components/DoctorCard";
import BookAppointmentModal from "../components/BookAppointmentModal";
import DoctorProfileModal, { type DoctorProfile, type PastVisit } from "../components/DoctorProfileModal";
import { useDoctors, useSpecialties } from "@/features/doctor/hooks/useDoctors";
import type { Doctor } from "@/types";

// -- Types --
interface DoctorData extends DoctorProfile {
    visitHistory: PastVisit[];
}

function mapDoctor(d: Doctor): DoctorData {
    return {
        id: d.id,
        name: [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unknown Doctor',
        specialty: d.specialty?.name ?? '',
        rating: d.rating ?? 0,
        experience: d.yearsOfPractice?.toString() ?? '',
        hospital: d.hospital ?? '',
        bio: d.bio ?? '',
        qualifications: [],
        languages: [],
        imageUrl: undefined,
        visitHistory: [],
    };
}

function BrowseDoctors() {
    // ---- MOCK SUBSCRIPTION STATE ----
    const isSubscribed: boolean = true;
    const freeConsultationsRemaining: number = 0;
    // ---------------------------------

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");

    const { data: specialties = [] } = useSpecialties();
    const [profileDoctor, setProfileDoctor] = useState<DoctorData | null>(null);
    const [bookingDoctor, setBookingDoctor] = useState<DoctorData | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isError } = useDoctors({
        search: debouncedSearch || undefined,
        specialty: selectedSpecialty !== "All" ? selectedSpecialty : undefined,
    });

    const doctors: DoctorData[] = (data?.doctors ?? []).map(mapDoctor);

    const handleViewProfile = (id: string) => {
        const doc = doctors.find(d => d.id === id);
        if (doc) setProfileDoctor(doc);
    };

    const handleBook = (id: string) => {
        const doc = doctors.find(d => d.id === id);
        if (doc) { setProfileDoctor(null); setBookingDoctor(doc); }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header & Search Section */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-2">Find a Doctor</h1>
                <p className="text-neutral-600 font-poppins text-sm mb-6">
                    Search by name, specialty, or symptoms to find the right care for you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search doctors, specialties, symptoms..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="sm:w-auto w-full flex items-center justify-center px-6 py-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-neutral-700 font-poppins text-sm font-semibold shrink-0">
                        <FiFilter className="mr-2" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Specialties Filter Chips */}
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
                {["All", ...specialties.map(s => s.name)].map(name => (
                    <button
                        key={name}
                        onClick={() => setSelectedSpecialty(name)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full font-poppins text-sm font-semibold transition-colors border ${selectedSpecialty === name
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                            }`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Subscription Context Banner */}
            {!isSubscribed && freeConsultationsRemaining === 0 && (
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-archivo font-bold text-primary-900">Unlock Unlimited Consultations</h4>
                        <p className="text-sm font-poppins text-primary-700 mt-1">
                            You've used your free consultation. Subscribe now to book unlimited appointments with any specialist.
                        </p>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            <div>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl">
                        <p className="text-neutral-500 font-poppins">Failed to load doctors. Please try again.</p>
                    </div>
                ) : (
                    <>
                        <p className="font-poppins text-sm font-medium text-neutral-500 mb-4">
                            Showing {doctors.length} specialists
                        </p>

                        {doctors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {doctors.map(doctor => (
                                    <DoctorCard
                                        key={doctor.id}
                                        {...doctor}
                                        visitCount={doctor.visitHistory.filter(v => v.status === "Completed").length}
                                        isSubscribed={isSubscribed}
                                        freeConsultationsRemaining={freeConsultationsRemaining}
                                        onViewProfile={handleViewProfile}
                                        onBook={handleBook}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl">
                                <p className="text-neutral-500 font-poppins">No doctors found matching your criteria.</p>
                                <button
                                    onClick={() => { setSearchTerm(""); setSelectedSpecialty("All"); }}
                                    className="mt-4 text-primary-600 font-semibold font-poppins hover:text-primary-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Doctor Profile Modal */}
            <DoctorProfileModal
                isOpen={!!profileDoctor}
                onClose={() => setProfileDoctor(null)}
                doctor={profileDoctor}
                pastVisits={profileDoctor?.visitHistory}
                onBook={() => profileDoctor && handleBook(profileDoctor.id)}
            />

            {/* Book Appointment Modal */}
            <BookAppointmentModal
                isOpen={!!bookingDoctor}
                onClose={() => setBookingDoctor(null)}
                doctor={bookingDoctor}
            />
        </div>
    );
}

export default BrowseDoctors;
