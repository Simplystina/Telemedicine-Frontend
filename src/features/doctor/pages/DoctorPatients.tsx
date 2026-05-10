import { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUsers, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import type { Appointment } from "@/types";

interface DerivedPatient {
    id: string;
    name: string;
    lastVisit: string | null;
    nextVisit: string | null;
    status: "active" | "inactive";
    lastReason: string | null;
}

const today = new Date().toISOString().slice(0, 10);

function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

function derivePatients(appointments: Appointment[]): DerivedPatient[] {
    const map = new Map<string, DerivedPatient & { _lastVisitRaw: string | null; _nextVisitRaw: string | null }>();

    for (const appt of appointments) {
        const pid = appt.patient?.id ?? appt.patientId;
        const nameParts = [appt.patient?.firstName, appt.patient?.lastName].filter(Boolean);
        const name = nameParts.join(' ') || 'Unknown Patient';

        if (!map.has(pid)) {
            map.set(pid, { id: pid, name, lastVisit: null, nextVisit: null, status: 'inactive', lastReason: null, _lastVisitRaw: null, _nextVisitRaw: null });
        }

        const p = map.get(pid)!;

        if (appt.status === 'completed') {
            if (!p._lastVisitRaw || appt.date > p._lastVisitRaw) {
                p._lastVisitRaw = appt.date;
                p.lastVisit = formatDate(appt.date);
                p.lastReason = appt.reason ?? null;
            }
        }

        if ((appt.status === 'pending' || appt.status === 'confirmed') && appt.date >= today) {
            if (!p._nextVisitRaw || appt.date < p._nextVisitRaw) {
                p._nextVisitRaw = appt.date;
                p.nextVisit = formatDate(appt.date);
                p.status = 'active';
            }
        }
    }

    return Array.from(map.values()).sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
        if (!a._lastVisitRaw && !b._lastVisitRaw) return 0;
        if (!a._lastVisitRaw) return 1;
        if (!b._lastVisitRaw) return -1;
        return b._lastVisitRaw.localeCompare(a._lastVisitRaw);
    });
}

function DoctorPatients() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

    const { data, isLoading } = useAppointments();
    const allAppointments = data?.appointments ?? [];
    const patients = derivePatients(allAppointments);

    const filtered = patients.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    const activeCount = patients.filter(p => p.status === 'active').length;
    const inactiveCount = patients.filter(p => p.status === 'inactive').length;

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
                    {isLoading ? (
                        <div className="h-8 w-12 bg-neutral-100 rounded-lg animate-pulse mx-auto mb-1" />
                    ) : (
                        <p className="text-2xl font-archivo font-bold text-primary-600">{patients.length}</p>
                    )}
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Total Patients</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 text-center">
                    {isLoading ? (
                        <div className="h-8 w-12 bg-neutral-100 rounded-lg animate-pulse mx-auto mb-1" />
                    ) : (
                        <p className="text-2xl font-archivo font-bold text-green-600">{activeCount}</p>
                    )}
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Active</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 text-center">
                    {isLoading ? (
                        <div className="h-8 w-12 bg-neutral-100 rounded-lg animate-pulse mx-auto mb-1" />
                    ) : (
                        <p className="text-2xl font-archivo font-bold text-neutral-400">{inactiveCount}</p>
                    )}
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Inactive</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by patient name..."
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
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 h-44 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 text-center">
                    <FiUsers className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="font-poppins text-neutral-500">
                        {patients.length === 0 ? "No patients yet. They'll appear here once appointments are booked." : "No patients match your search."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 hover:border-primary-200 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo shrink-0">
                                        {patient.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold font-poppins text-neutral-900">{patient.name}</h3>
                                        {patient.lastReason && (
                                            <p className="text-xs font-poppins text-neutral-500 line-clamp-1">{patient.lastReason}</p>
                                        )}
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
                                    <span className="text-xs font-poppins text-neutral-500">Last Visit</span>
                                    <span className="text-xs font-poppins text-neutral-700">
                                        {patient.lastVisit ?? <span className="text-neutral-400">—</span>}
                                    </span>
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
