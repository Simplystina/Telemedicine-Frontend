import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiVideo, FiClock, FiSearch, FiFilter, FiPlus } from "react-icons/fi";
import ScheduleAppointmentModal from "../components/ScheduleAppointmentModal";

type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled";

interface Appointment {
    id: string;
    patient: string;
    type: string;
    date: string;
    time: string;
    status: AppointmentStatus;
    notes?: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: "a1", patient: "Jane Doe", type: "Follow-up", date: "Mar 31, 2026", time: "09:00 AM", status: "confirmed" },
    { id: "a2", patient: "Emeka Eze", type: "New Consultation", date: "Mar 31, 2026", time: "10:30 AM", status: "confirmed" },
    { id: "a3", patient: "Aisha Bello", type: "Routine Check", date: "Mar 31, 2026", time: "01:00 PM", status: "pending" },
    { id: "a4", patient: "Chidi Okeke", type: "Follow-up", date: "Mar 31, 2026", time: "03:00 PM", status: "confirmed" },
    { id: "a5", patient: "Ngozi Adeyemi", type: "New Consultation", date: "Mar 29, 2026", time: "11:00 AM", status: "completed", notes: "Prescribed antibiotics" },
    { id: "a6", patient: "David Okonkwo", type: "Cardiology Review", date: "Mar 28, 2026", time: "02:00 PM", status: "completed" },
    { id: "a7", patient: "Fatima Musa", type: "Follow-up", date: "Mar 27, 2026", time: "10:00 AM", status: "cancelled" },
];

const statusStyles: Record<AppointmentStatus, string> = {
    confirmed: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-600",
};

const tabs: { label: string; value: string }[] = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

function DoctorAppointments() {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = MOCK_APPOINTMENTS.filter((a) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "today" && a.date === "Mar 31, 2026") ||
            (activeTab === "upcoming" && a.status === "confirmed") ||
            a.status === activeTab;
        const matchesSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Appointments</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        Manage your upcoming, past, and pending appointments.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-poppins font-bold text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>New Appointment</span>
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search patient or type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-poppins text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                    <FiFilter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1 w-fit overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 rounded-lg font-poppins text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.value
                            ? "bg-white text-primary-700 shadow-sm font-semibold"
                            : "text-neutral-600 hover:text-neutral-900"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiCalendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <p className="font-poppins text-neutral-500">No appointments found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {filtered.map((appt) => (
                            <div key={appt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-sm shrink-0">
                                        {appt.patient.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <Link to={`/doctor/patients/${appt.id}`} className="text-sm font-bold font-poppins text-neutral-900 hover:text-primary-600 transition-colors">
                                            {appt.patient}
                                        </Link>
                                        <p className="text-xs font-poppins text-neutral-500">{appt.type}</p>
                                        {appt.notes && (
                                            <p className="text-xs font-poppins text-neutral-400 italic mt-0.5">{appt.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 ml-15 sm:ml-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-semibold font-poppins text-neutral-900">{appt.date}</p>
                                        <p className="text-xs font-poppins text-neutral-500 flex items-center sm:justify-end mt-0.5">
                                            <FiClock className="w-3 h-3 mr-1" />
                                            {appt.time}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold font-poppins capitalize ${statusStyles[appt.status]}`}>
                                        {appt.status}
                                    </span>
                                    {(appt.status === "confirmed" || appt.status === "pending") && (
                                        <Link
                                            to={`/doctor/call/${appt.id}`}
                                            className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                                            title="Start Video Call"
                                        >
                                            <FiVideo className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Manual Appointment Modal */}
            <ScheduleAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default DoctorAppointments;

