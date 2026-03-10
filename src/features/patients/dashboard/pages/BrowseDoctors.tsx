import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import DoctorCard from "../components/DoctorCard";

// Mock Data
const MOCK_DOCTORS = [
    {
        id: "1",
        name: "Sarah Jenkins",
        specialty: "Cardiologist",
        rating: 4.9,
        experience: "10 yrs",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: "2",
        name: "David Chen",
        specialty: "Dermatologist",
        rating: 4.7,
        experience: "8 yrs",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: "3",
        name: "Emily Clark",
        specialty: "Pediatrician",
        rating: 5.0,
        experience: "15 yrs",
        imageUrl: "https://images.unsplash.com/photo-1594824436998-dd40e4f29d4b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: "4",
        name: "Marcus Johnson",
        specialty: "General Physician",
        rating: 4.6,
        experience: "5 yrs",
    },
    {
        id: "5",
        name: "Priya Patel",
        specialty: "Psychiatrist",
        rating: 4.8,
        experience: "12 yrs",
    },
    {
        id: "6",
        name: "Anas Malik",
        specialty: "Neurologist",
        rating: 4.9,
        experience: "20 yrs",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
];

const SPECIALTIES = ["All", "General Physician", "Cardiologist", "Dermatologist", "Pediatrician", "Psychiatrist", "Neurologist"];

function BrowseDoctors() {
    // ---- MOCK SUBSCRIPTION STATE ----
    // Toggle these values to see how the UI changes!
    const isSubscribed: boolean = true;
    const freeConsultationsRemaining: number = 0;
    // ---------------------------------

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");

    // Filter logic
    const filteredDoctors = MOCK_DOCTORS.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

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
                {SPECIALTIES.map(specialty => (
                    <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full font-poppins text-sm font-semibold transition-colors border ${selectedSpecialty === specialty
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                            }`}
                    >
                        {specialty}
                    </button>
                ))}
            </div>

            {/* Subscription Context Banner (Only show if unstructured/no free consults) */}
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
                <p className="font-poppins text-sm font-medium text-neutral-500 mb-4">
                    Showing {filteredDoctors.length} specialists
                </p>

                {filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDoctors.map(doctor => (
                            <DoctorCard
                                key={doctor.id}
                                {...doctor}
                                isSubscribed={isSubscribed}
                                freeConsultationsRemaining={freeConsultationsRemaining}
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
            </div>

        </div>
    );
}

export default BrowseDoctors;
