import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronRight, FiUser } from "react-icons/fi";
import { useAdminPatients } from "@/features/admin/hooks/useAdmin";

type StatusFilter = "all" | "active" | "inactive";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AdminPatients() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const { data, isLoading } = useAdminPatients({ search: search || undefined });
    const patients = data?.data ?? [];

    const filtered = statusFilter === "all"
        ? patients
        : patients.filter(p => statusFilter === "active" ? p.user?.isActive !== false : p.user?.isActive === false);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Patient Registry</h1>
                    <p className="text-neutral-600 font-poppins text-sm">View and manage all registered patients.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 flex items-center w-72 shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <FiSearch className="text-neutral-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search patients..."
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

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="px-6 py-5 flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-neutral-100 animate-pulse shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-neutral-100 rounded animate-pulse w-40" />
                                    <div className="h-3 bg-neutral-100 rounded animate-pulse w-56" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiUser className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-neutral-400 font-poppins text-sm">No patients found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {filtered.map(patient => {
                            const name = [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unknown Patient";
                            const initials = [patient.firstName, patient.lastName].filter(Boolean).map(n => n![0]).join("").toUpperCase() || "?";
                            const isActive = patient.user?.isActive !== false;
                            return (
                                <button
                                    key={patient.id}
                                    onClick={() => navigate(`/admin/patients/${patient.id}`)}
                                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-neutral-50 transition-colors text-left group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-sm shrink-0 uppercase">
                                            {initials}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">{name}</p>
                                                <span className={`text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                                    {isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            <p className="text-xs font-poppins text-neutral-500 mt-0.5">
                                                {patient.user?.email ?? "—"}
                                                {patient.user?.createdAt ? ` · Joined ${formatDate(patient.user.createdAt)}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <FiChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors ml-4 shrink-0" />
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-sm font-poppins text-neutral-500">
                    <p>Showing {filtered.length} of {data?.meta.total ?? 0} patients</p>
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

export default AdminPatients;
