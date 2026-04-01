import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiChevronRight, FiStar, FiCalendar, FiUsers } from "react-icons/fi";

const DOCTORS = [
    {
        id: "d1",
        name: "Dr. Michael Chen",
        specialty: "Neurology",
        email: "m.chen@med.com",
        phone: "+1 (555) 201-3344",
        status: "Active",
        joinDate: "Mar 25, 2026",
        patients: 48,
        appointments: 120,
        rating: 4.8,
        licenseNo: "LIC-2024-NG-7741",
        hospital: "St. Mary's General Hospital",
        bio: "Dr. Michael Chen is a board-certified neurologist with over 10 years of experience treating complex neurological conditions.",
        location: "Lagos, Nigeria",
        // Live status
        isInConsultation: true,
        currentPatient: { name: "Grace Obi", type: "Follow-up", startedAt: "10:05 AM" },
        consultationDuration: "28 min",
        // Availability
        availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        availabilityHours: "9:00 AM – 5:00 PM",
        nextAvailable: "Today, 11:30 AM",
        // Upcoming appointments
        upcomingAppointments: [
            { patient: "Emma Wilson", type: "New Consultation", time: "11:30 AM", date: "Today" },
            { patient: "Robert Adeyemi", type: "Follow-up", time: "01:00 PM", date: "Today" },
            { patient: "Fatima Hassan", type: "Routine Check", time: "09:00 AM", date: "Tomorrow" },
        ],
        // Patient breakdown
        newPatientsThisMonth: 6,
        returningPatients: 42,
    },
    {
        id: "d2",
        name: "Dr. Amina Bello",
        specialty: "Cardiology",
        email: "a.bello@med.com",
        phone: "+1 (555) 304-8821",
        status: "Active",
        joinDate: "Feb 10, 2026",
        patients: 72,
        appointments: 210,
        rating: 4.9,
        licenseNo: "LIC-2023-NG-5512",
        hospital: "National Cardiology Centre",
        bio: "Dr. Amina Bello is a highly regarded cardiologist known for her patient-centred approach and expertise in interventional cardiology.",
        location: "Abuja, Nigeria",
        isInConsultation: false,
        currentPatient: null,
        consultationDuration: null,
        availabilityDays: ["Mon", "Wed", "Fri"],
        availabilityHours: "8:00 AM – 3:00 PM",
        nextAvailable: "Today, 2:00 PM",
        upcomingAppointments: [
            { patient: "Marcus Johnson", type: "Follow-up", time: "02:00 PM", date: "Today" },
            { patient: "Ngozi Eze", type: "Cardiac Review", time: "10:00 AM", date: "Tomorrow" },
        ],
        newPatientsThisMonth: 11,
        returningPatients: 61,
    },
    {
        id: "d3",
        name: "Dr. Elena Rossi",
        specialty: "Pediatrics",
        email: "e.rossi@med.com",
        phone: "+1 (555) 412-5566",
        status: "Suspended",
        joinDate: "Jan 5, 2026",
        patients: 31,
        appointments: 88,
        rating: 4.2,
        licenseNo: "LIC-2022-NG-3301",
        hospital: "Children's Health Institute",
        bio: "Dr. Elena Rossi is a paediatric specialist dedicated to child health and development.",
        location: "Port Harcourt, Nigeria",
        isInConsultation: false,
        currentPatient: null,
        consultationDuration: null,
        availabilityDays: ["Tue", "Thu"],
        availabilityHours: "10:00 AM – 4:00 PM",
        nextAvailable: "Account Suspended",
        upcomingAppointments: [],
        newPatientsThisMonth: 0,
        returningPatients: 31,
    },
    {
        id: "d4",
        name: "Dr. James Okafor",
        specialty: "General Medicine",
        email: "j.okafor@med.com",
        phone: "+1 (555) 521-9977",
        status: "Active",
        joinDate: "Mar 1, 2026",
        patients: 95,
        appointments: 340,
        rating: 4.6,
        licenseNo: "LIC-2021-NG-1188",
        hospital: "Lagos General Hospital",
        bio: "Dr. James Okafor is a seasoned general practitioner with extensive experience managing chronic diseases and preventive care.",
        location: "Lagos, Nigeria",
        isInConsultation: true,
        currentPatient: { name: "Bola Adesanya", type: "New Consultation", startedAt: "10:20 AM" },
        consultationDuration: "13 min",
        availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        availabilityHours: "7:00 AM – 6:00 PM",
        nextAvailable: "Today, 11:00 AM",
        upcomingAppointments: [
            { patient: "Chukwudi Nweze", type: "Routine Check", time: "11:00 AM", date: "Today" },
            { patient: "Amara Obi", type: "Follow-up", time: "12:30 PM", date: "Today" },
            { patient: "Solomon Adebayo", type: "New Consultation", time: "02:00 PM", date: "Today" },
            { patient: "Kemi Lawal", type: "Follow-up", time: "09:00 AM", date: "Tomorrow" },
        ],
        newPatientsThisMonth: 18,
        returningPatients: 77,
    },
];

function AdminDoctorList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Suspended">("All");

    const filtered = DOCTORS.filter(d =>
        (statusFilter === "All" || d.status === statusFilter) &&
        (d.name.toLowerCase().includes(search.toLowerCase()) ||
         d.specialty.toLowerCase().includes(search.toLowerCase()) ||
         d.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Doctor Registry</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        Manage verified doctors on the platform. Pending applicants are reviewed separately.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 flex items-center w-72 shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <FiSearch className="text-neutral-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-poppins text-neutral-900 w-full placeholder:text-neutral-400"
                        />
                    </div>
                    {/* Filter */}
                    <div className="flex items-center bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
                        {(["All", "Active", "Suspended"] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-4 py-2.5 text-xs font-semibold font-poppins transition-colors ${
                                    statusFilter === f
                                        ? "bg-primary-500 text-white"
                                        : "text-neutral-500 hover:bg-neutral-50"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button className="p-2.5 bg-white border border-neutral-200 text-neutral-500 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                        <FiFilter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Doctors", value: DOCTORS.length, color: "text-primary-600", bg: "bg-primary-50" },
                    { label: "Active", value: DOCTORS.filter(d => d.status === "Active").length, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Suspended", value: DOCTORS.filter(d => d.status === "Suspended").length, color: "text-red-600", bg: "bg-red-50" },
                    { label: "Specialties", value: new Set(DOCTORS.map(d => d.specialty)).size, color: "text-blue-600", bg: "bg-blue-50" },
                ].map(card => (
                    <div key={card.label} className={`${card.bg} rounded-xl p-4 border border-neutral-100`}>
                        <p className="text-xs font-poppins text-neutral-500 mb-1">{card.label}</p>
                        <p className={`text-2xl font-archivo font-bold ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Doctor List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-100">
                    {filtered.length === 0 ? (
                        <div className="p-12 text-center text-neutral-400 font-poppins text-sm">
                            No doctors match your search.
                        </div>
                    ) : filtered.map(doctor => (
                        <button
                            key={doctor.id}
                            onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                            className="w-full flex items-center justify-between px-6 py-5 hover:bg-neutral-50 transition-colors text-left group"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-sm shrink-0">
                                    {doctor.name.split(" ").map(n => n[0]).join("").slice(1, 3)}
                                </div>
                                {/* Info */}
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-semibold font-poppins text-neutral-900">{doctor.name}</p>
                                        <span className={`text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full ${
                                            doctor.status === "Active"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-700"
                                        }`}>
                                            {doctor.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-poppins text-neutral-500 mt-0.5">{doctor.specialty} · {doctor.hospital}</p>
                                </div>
                            </div>
                            {/* Stats */}
                            <div className="hidden md:flex items-center space-x-6 text-xs font-poppins text-neutral-500">
                                <div className="flex items-center space-x-1">
                                    <FiUsers className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>{doctor.patients} patients</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FiCalendar className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>{doctor.appointments} appts</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FiStar className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{doctor.rating}</span>
                                </div>
                                <div className="text-neutral-400">{doctor.joinDate}</div>
                            </div>
                            <FiChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors ml-4 shrink-0" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { DOCTORS };
export default AdminDoctorList;
