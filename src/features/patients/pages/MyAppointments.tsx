import { useState, useRef, useEffect } from "react";
import { FiCalendar, FiClock, FiVideo, FiFileText, FiMoreVertical, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import VisitSummaryModal, { type VisitSummary } from "../components/VisitSummaryModal";
import RescheduleModal, { type AppointmentToReschedule } from "../components/RescheduleModal";

// ---- Types ----
interface UpcomingAppointment {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
    imageUrl?: string;
}

// Mock Appointments Data
const UPCOMING_APPOINTMENTS: UpcomingAppointment[] = [
    {
        id: "1",
        doctorName: "Dr. Sarah Jenkins",
        specialty: "Cardiologist",
        date: "Oct 24, 2023",
        time: "10:00 AM - 10:30 AM",
        status: "Confirmed",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "2",
        doctorName: "Dr. Marcus Johnson",
        specialty: "General Physician",
        date: "Oct 28, 2023",
        time: "02:00 PM - 02:45 PM",
        status: "Pending",
    }
];

const PAST_APPOINTMENTS: Array<{
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
    imageUrl?: string;
    visitSummary?: VisitSummary;
}> = [
        {
            id: "3",
            doctorName: "Dr. Emily Clark",
            specialty: "Pediatrician",
            date: "Sep 15, 2023",
            time: "11:00 AM - 11:30 AM",
            status: "Completed",
            imageUrl: "https://images.unsplash.com/photo-1594824436998-dd40e4f29d4b?w=500&auto=format&fit=crop&q=60",
            visitSummary: {
                recordTitle: "Visit Summary — Sep 15, 2023",
                doctorName: "Dr. Emily Clark",
                facilityName: "Oak Clinical Associates",
                visitDate: "Sep 15, 2023",
                diagnosis: "Mild upper respiratory tract infection. No signs of bacterial infection or pneumonia. Symptoms are consistent with a common viral illness.",
                prescription: [
                    "Paracetamol 500mg — Take 2 tablets every 6 hours for 5 days",
                    "Vitamin C 1000mg — Take 1 tablet daily for 2 weeks",
                    "Plenty of fluids and bed rest",
                ],
                doctorsAdvice: "Avoid strenuous activity for the next 5 days. If symptoms worsen or fever exceeds 39°C, return immediately or visit the nearest clinic.",
                followUpDate: "Sep 22, 2023",
            }
        },
        {
            id: "4",
            doctorName: "Dr. David Chen",
            specialty: "Dermatologist",
            date: "Aug 02, 2023",
            time: "09:15 AM - 09:45 AM",
            status: "Completed",
            imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60",
            visitSummary: {
                recordTitle: "Dermatology Consultation — Aug 02, 2023",
                doctorName: "Dr. David Chen",
                facilityName: "ClearSkin Dermatology",
                visitDate: "Aug 02, 2023",
                diagnosis: "Mild eczema (atopic dermatitis) on the forearms and neck. Condition is manageable with topical treatment. No systemic involvement detected.",
                prescription: [
                    "Hydrocortisone cream 1% — Apply thinly to affected areas twice daily for 2 weeks",
                    "Cetirizine 10mg — Take 1 tablet at night for 10 days to reduce itching",
                    "Fragrance-free moisturiser — Apply generously after bathing",
                ],
                doctorsAdvice: "Avoid harsh soaps and synthetic clothing on affected areas. Use lukewarm water when bathing. Stress and sweating can trigger flares.",
                followUpDate: "Sep 02, 2023",
            }
        }
    ];

// ---- Dropdown Menu Component ----
function AppointmentMenu({
    appointment,
    onReschedule,
    onCancel,
}: {
    appointment: UpcomingAppointment;
    onReschedule: (appt: UpcomingAppointment) => void;
    onCancel: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="p-2.5 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
            >
                <FiMoreVertical className="w-5 h-5" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 z-20 overflow-hidden animate-fade-in">
                    <button
                        onClick={() => { setOpen(false); onReschedule(appointment); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-poppins text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                        <FiRefreshCw className="w-4 h-4 text-primary-500" />
                        Reschedule
                    </button>
                    <div className="border-t border-neutral-100" />
                    <button
                        onClick={() => { setOpen(false); onCancel(appointment.id); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-poppins text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <FiXCircle className="w-4 h-4" />
                        Cancel Appointment
                    </button>
                </div>
            )}
        </div>
    );
}

// ---- Main Page ----
function MyAppointments() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
    const [selectedSummary, setSelectedSummary] = useState<VisitSummary | null>(null);
    const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentToReschedule | null>(null);

    const appointmentsToShow = activeTab === "upcoming" ? UPCOMING_APPOINTMENTS : PAST_APPOINTMENTS;

    const handleCancel = (_id: string) => {
        // TODO: hook up to API — show confirmation dialog before cancelling
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">My Appointments</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    Manage your upcoming consultations and review your past visits.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-6 py-3 font-poppins text-sm font-semibold transition-colors border-b-2 ${activeTab === "upcoming"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab("past")}
                    className={`px-6 py-3 font-poppins text-sm font-semibold transition-colors border-b-2 ${activeTab === "past"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                        }`}
                >
                    Past
                </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {appointmentsToShow.length > 0 ? (
                    appointmentsToShow.map((appointment) => (
                        <div key={appointment.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">

                            {/* Left Side: Doctor Info & Date */}
                            <div className="flex items-start sm:items-center space-x-4 flex-1">
                                <div className="w-16 h-16 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                                    {appointment.imageUrl ? (
                                        <img src={appointment.imageUrl} alt={appointment.doctorName} className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserDoctor className="w-8 h-8 text-primary-400" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-archivo font-bold text-lg text-neutral-900">{appointment.doctorName}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-poppins uppercase tracking-wide ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-neutral-100 text-neutral-600'
                                            }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <p className="font-poppins text-sm text-neutral-500 mb-2">{appointment.specialty}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm font-poppins text-neutral-700">
                                        <span className="flex items-center"><FiCalendar className="mr-1.5 text-neutral-400" /> {appointment.date}</span>
                                        <span className="flex items-center"><FiClock className="mr-1.5 text-neutral-400" /> {appointment.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Actions */}
                            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t border-neutral-100 pt-4 md:border-t-0 md:pt-0">
                                {activeTab === "upcoming" ? (
                                    <>
                                        <button
                                            onClick={() => navigate(`/patient/call/${appointment.id}`)}
                                            className="flex-1 md:flex-none flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors">
                                            <FiVideo className="mr-2" /> Join Call
                                        </button>
                                        <AppointmentMenu
                                            appointment={appointment as UpcomingAppointment}
                                            onReschedule={(appt) => setRescheduleAppointment(appt)}
                                            onCancel={handleCancel}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                const appt = appointment as typeof PAST_APPOINTMENTS[0];
                                                if (appt.visitSummary) setSelectedSummary(appt.visitSummary);
                                            }}
                                            disabled={!(appointment as typeof PAST_APPOINTMENTS[0]).visitSummary}
                                            className="flex-1 md:flex-none flex items-center justify-center bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <FiFileText className="mr-2 text-neutral-500" /> View Notes
                                        </button>
                                        <button className="flex-1 md:flex-none flex items-center justify-center bg-primary-50 text-primary-700 hover:bg-primary-100 px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors">
                                            Re-book
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl">
                        <p className="text-neutral-500 font-poppins mb-2">You have no {activeTab} appointments.</p>
                        {activeTab === "upcoming" && (
                            <button className="text-primary-600 font-semibold font-poppins hover:text-primary-700">
                                Find a Doctor to book one
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Visit Summary Modal */}
            <VisitSummaryModal
                isOpen={!!selectedSummary}
                onClose={() => setSelectedSummary(null)}
                summary={selectedSummary}
            />

            {/* Reschedule Modal */}
            <RescheduleModal
                isOpen={!!rescheduleAppointment}
                onClose={() => setRescheduleAppointment(null)}
                appointment={rescheduleAppointment}
            />
        </div>
    );
}

export default MyAppointments;
