import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronRight, FiStar } from "react-icons/fi";
import { useAdminDoctors, useAdminDashboard } from "@/features/admin/hooks/useAdmin";
import type { DoctorStatus } from "@/types";

type StatusFilter = "all" | DoctorStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Verified", value: "verified" },
    { label: "Pending", value: "pending" },
    { label: "Suspended", value: "suspended" },
];

const STATUS_BADGE: Record<DoctorStatus, string> = {
    verified: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    suspended: "bg-red-50 text-red-700",
};

function AdminDoctorList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const queryParams = {
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
    };

    const { data, isLoading } = useAdminDoctors(queryParams);
    const { data: stats } = useAdminDashboard();
    const doctors = data?.data ?? [];

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Doctor Registry</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        Review doctor profiles and manage their verification status.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
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
                    <div className="flex items-center bg-neutral-200/70 border border-neutral-200 rounded-xl p-1 gap-0.5 shadow-inner">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`relative px-4 py-2 text-xs font-semibold font-poppins transition-all duration-200 ${
                                    statusFilter === tab.value
                                        ? "bg-primary-500 text-white shadow-sm"
                                        : "text-neutral-500 hover:text-neutral-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Doctors", value: stats?.doctors.total, color: "text-primary-600", bg: "bg-primary-50" },
                    { label: "Verified", value: stats?.doctors.verified, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Pending", value: stats?.doctors.pending, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Suspended", value: stats?.doctors.suspended, color: "text-red-600", bg: "bg-red-50" },
                ].map(card => (
                    <div key={card.label} className={`${card.bg} rounded-xl p-4 border border-neutral-100`}>
                        <p className="text-xs font-poppins text-neutral-500 mb-1">{card.label}</p>
                        <p className={`text-2xl font-archivo font-bold ${card.color}`}>
                            {card.value ?? "—"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Doctor List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-6 py-5 flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-neutral-100 animate-pulse shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-neutral-100 rounded animate-pulse w-48" />
                                    <div className="h-3 bg-neutral-100 rounded animate-pulse w-64" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {doctors.length === 0 ? (
                            <div className="p-12 text-center text-neutral-400 font-poppins text-sm">
                                No doctors match your search.
                            </div>
                        ) : doctors.map(doctor => {
                            const initials = [doctor.firstName, doctor.lastName]
                                .filter(Boolean)
                                .map(n => n![0])
                                .join('') || '?';
                            const fullName = [doctor.firstName, doctor.lastName].filter(Boolean).join(' ') || 'Unnamed Doctor';

                            return (
                                <button
                                    key={doctor.id}
                                    onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-neutral-50 transition-colors text-left group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-sm shrink-0 uppercase">
                                            {initials}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">
                                                    Dr. {fullName}
                                                </p>
                                                <span className={`text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[doctor.status]}`}>
                                                    {doctor.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-poppins text-neutral-500 mt-0.5">
                                                {[doctor.specialty?.name, doctor.hospital].filter(Boolean).join(' · ') || 'No specialty set'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center space-x-6 text-xs font-poppins text-neutral-500">
                                        {doctor.licenseNo && (
                                            <span className="font-mono text-neutral-400">{doctor.licenseNo}</span>
                                        )}
                                        {doctor.rating != null && (
                                            <div className="flex items-center space-x-1">
                                                <FiStar className="w-3.5 h-3.5 text-amber-400" />
                                                <span>{doctor.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                        <span className="text-neutral-300">{doctor.user?.email}</span>
                                    </div>

                                    <FiChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors ml-4 shrink-0" />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDoctorList;
