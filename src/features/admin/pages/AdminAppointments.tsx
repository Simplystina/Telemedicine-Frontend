import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiCalendar, FiChevronRight, FiClock } from "react-icons/fi";
import { useAdminAppointments } from "@/features/admin/hooks/useAdmin";
import type { AppointmentStatus } from "@/types";

type StatusFilter = "all" | AppointmentStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rescheduled", value: "rescheduled" },
    { label: "No Show", value: "no_show" },
    { label: "Expired", value: "expired" },
];

const STATUS_BADGE: Record<AppointmentStatus, string> = {
    pending:     "bg-amber-50 text-amber-700",
    confirmed:   "bg-blue-50 text-blue-700",
    completed:   "bg-green-50 text-green-700",
    cancelled:   "bg-red-50 text-red-700",
    rescheduled: "bg-purple-50 text-purple-700",
    no_show:     "bg-neutral-100 text-neutral-600",
    expired:     "bg-neutral-100 text-neutral-500",
};

function to12h(time: string | undefined) {
    if (!time) return "—";
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AdminAppointments() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const { data, isLoading } = useAdminAppointments({
        status: statusFilter !== "all" ? statusFilter : undefined,
        from: from || undefined,
        to: to || undefined,
    });
    const appointments = data?.data ?? [];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Appointments</h1>
                    <p className="text-neutral-600 font-poppins text-sm">Monitor all patient-doctor appointments across the platform.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 flex items-center w-64 shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <FiSearch className="text-neutral-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search patient or doctor..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-poppins text-neutral-900 w-full placeholder:text-neutral-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="date" value={from} onChange={e => setFrom(e.target.value)}
                            className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm font-poppins text-neutral-700 shadow-sm outline-none focus:border-primary-300"
                        />
                        <span className="text-neutral-400 text-sm font-poppins">—</span>
                        <input
                            type="date" value={to} onChange={e => setTo(e.target.value)}
                            className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm font-poppins text-neutral-700 shadow-sm outline-none focus:border-primary-300"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center bg-white border border-neutral-200 rounded-xl shadow-sm overflow-x-auto">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value)}
                        className={`px-5 py-3 text-xs font-semibold font-poppins whitespace-nowrap transition-colors ${
                            statusFilter === tab.value ? "bg-primary-500 text-white" : "text-neutral-500 hover:bg-neutral-50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="px-6 py-5 flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-neutral-100 rounded animate-pulse w-48" />
                                    <div className="h-3 bg-neutral-100 rounded animate-pulse w-64" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiCalendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-neutral-400 font-poppins text-sm">No appointments found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-100 bg-neutral-50">
                                    <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {appointments.map(appt => {
                                    const patientName = [appt.patient?.firstName, appt.patient?.lastName].filter(Boolean).join(" ") || "Unknown";
                                    const doctorName = [appt.doctor?.firstName, appt.doctor?.lastName].filter(Boolean).join(" ") || "Unknown";
                                    return (
                                        <tr
                                            key={appt.id}
                                            onClick={() => navigate(`/admin/appointments/${appt.id}`)}
                                            className="hover:bg-neutral-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">{patientName}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-poppins text-neutral-700">Dr. {doctorName}</p>
                                                {appt.doctor?.specialty?.name && (
                                                    <p className="text-xs font-poppins text-neutral-400">{appt.doctor.specialty.name}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-poppins text-neutral-900 flex items-center gap-1.5">
                                                    <FiCalendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                    {formatDate(appt.date)}
                                                </p>
                                                <p className="text-xs font-poppins text-neutral-500 flex items-center gap-1.5 mt-0.5">
                                                    <FiClock className="w-3 h-3 text-neutral-400 shrink-0" />
                                                    {to12h(appt.startTime)} – {to12h(appt.endTime)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-semibold font-poppins capitalize text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
                                                    {appt.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold font-poppins capitalize px-2.5 py-1 rounded-full ${STATUS_BADGE[appt.status]}`}>
                                                    {appt.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <FiChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-sm font-poppins text-neutral-500">
                    <p>Showing {appointments.length} of {data?.meta.total ?? 0} appointments</p>
                    <div className="flex items-center space-x-1">
                        <button className="px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-white disabled:opacity-40 text-xs font-semibold" disabled>Prev</button>
                        <button className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-semibold shadow-sm">1</button>
                        <button className="px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-white text-xs font-semibold">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAppointments;
