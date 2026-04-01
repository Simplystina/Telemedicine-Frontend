import { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUsers, FiCalendar, FiMessageSquare } from "react-icons/fi";

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    condition: string;
    lastVisit: string;
    nextVisit?: string;
    status: "active" | "inactive";
}

const MOCK_PATIENTS: Patient[] = [
    { id: "p1", name: "Jane Doe", age: 34, gender: "Female", condition: "Hypertension", lastVisit: "Mar 29, 2026", nextVisit: "Mar 31, 2026", status: "active" },
    { id: "p2", name: "Emeka Eze", age: 45, gender: "Male", condition: "Type 2 Diabetes", lastVisit: "Mar 25, 2026", nextVisit: "Mar 31, 2026", status: "active" },
    { id: "p3", name: "Aisha Bello", age: 28, gender: "Female", condition: "Anxiety Disorder", lastVisit: "Mar 15, 2026", status: "active" },
    { id: "p4", name: "Chidi Okeke", age: 52, gender: "Male", condition: "Heart Arrhythmia", lastVisit: "Mar 10, 2026", nextVisit: "Mar 31, 2026", status: "active" },
    { id: "p5", name: "Ngozi Adeyemi", age: 61, gender: "Female", condition: "Arthritis", lastVisit: "Feb 28, 2026", status: "inactive" },
    { id: "p6", name: "David Okonkwo", age: 39, gender: "Male", condition: "Asthma", lastVisit: "Mar 28, 2026", status: "active" },
    { id: "p7", name: "Fatima Musa", age: 22, gender: "Female", condition: "Anaemia", lastVisit: "Jan 10, 2026", status: "inactive" },
    { id: "p8", name: "Kunle Adeyemi", age: 48, gender: "Male", condition: "Chronic Back Pain", lastVisit: "Mar 20, 2026", status: "active" },
];

function DoctorPatients() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

    const filtered = MOCK_PATIENTS.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.condition.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">My Patients</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    View and manage all patients under your care.
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 text-center">
                    <p className="text-2xl font-archivo font-bold text-primary-600">{MOCK_PATIENTS.length}</p>
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Total Patients</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 text-center">
                    <p className="text-2xl font-archivo font-bold text-green-600">{MOCK_PATIENTS.filter(p => p.status === "active").length}</p>
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Active</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 text-center">
                    <p className="text-2xl font-archivo font-bold text-neutral-400">{MOCK_PATIENTS.filter(p => p.status === "inactive").length}</p>
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Inactive</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or condition..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                    />
                </div>
                <div className="flex bg-neutral-100 rounded-xl p-1 space-x-1">
                    {(["all", "active", "inactive"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize font-poppins text-sm font-medium transition-all ${filter === f
                                ? "bg-white text-primary-700 shadow-sm font-semibold"
                                : "text-neutral-600 hover:text-neutral-900"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patients Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 text-center">
                    <FiUsers className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="font-poppins text-neutral-500">No patients found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 hover:border-primary-200 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo shrink-0">
                                        {patient.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold font-poppins text-neutral-900">{patient.name}</h3>
                                        <p className="text-xs font-poppins text-neutral-500">{patient.age}y · {patient.gender}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold font-poppins px-2.5 py-1 rounded-full ${patient.status === "active"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-neutral-100 text-neutral-500"
                                    }`}>
                                    {patient.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-poppins text-neutral-500">Condition</span>
                                    <span className="text-xs font-semibold font-poppins text-neutral-900">{patient.condition}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-poppins text-neutral-500">Last Visit</span>
                                    <span className="text-xs font-poppins text-neutral-700">{patient.lastVisit}</span>
                                </div>
                                {patient.nextVisit && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-poppins text-neutral-500">Next Visit</span>
                                        <span className="text-xs font-poppins text-primary-600 font-semibold">{patient.nextVisit}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                                <Link
                                    to={`/doctor/patients/${patient.id}`}
                                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold font-poppins hover:bg-primary-100 transition-colors"
                                >
                                    <FiCalendar className="w-3.5 h-3.5" />
                                    <span>View Record</span>
                                </Link>
                                <Link
                                    to="/doctor/messages"
                                    className="flex items-center justify-center p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                                >
                                    <FiMessageSquare className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DoctorPatients;
