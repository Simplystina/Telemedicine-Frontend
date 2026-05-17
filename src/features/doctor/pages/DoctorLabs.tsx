import { useState } from "react";
import {
    FiSearch, FiActivity, FiMapPin, FiClock, FiEye, FiDownload, FiCheckCircle, FiX, FiFilter
} from "react-icons/fi";
import { useLabResults } from "@/features/labs/hooks/useLabs";
import { LabResultStatus } from "@/types";
import type { LabResult } from "@/types";

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

// ── Lab Result Row ───────────────────────────────────────────────────────────

function LabResultRow({ lab, onView }: {
    lab: LabResult;
    onView: () => void;
}) {
    const isPending = lab.status === LabResultStatus.REQUESTED || lab.status === LabResultStatus.PENDING;
    const isCompleted = lab.status === LabResultStatus.COMPLETED;

    return (
        <tr className="hover:bg-neutral-50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {formatDate(lab.requestedAt)}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <FiActivity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {lab.testName}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-poppins mt-0.5">
                            Patient: <span className="font-semibold text-neutral-700">{lab.patient ? `${lab.patient.firstName} ${lab.patient.lastName}` : 'Unknown Patient'}</span>
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    isCompleted ? 'bg-green-50 text-green-700' : 
                    isPending ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                }`}>
                    {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                    {lab.recommendedHospital && (
                        <span className="text-[11px] text-neutral-500 font-poppins flex items-center">
                            <FiMapPin className="mr-1 text-primary-400" /> {lab.recommendedHospital}
                        </span>
                    )}
                    {lab.dateDue && (
                        <span className="text-[11px] text-neutral-500 font-poppins flex items-center">
                            <FiClock className="mr-1 text-primary-400" /> Due: {formatDate(lab.dateDue)}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                    {isCompleted && lab.filePath ? (
                        <>
                            <button
                                onClick={onView}
                                className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="View Interpretation"
                            >
                                <FiEye className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => window.open(lab.filePath, '_blank')}
                                className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" 
                                title="Download Report"
                            >
                                <FiDownload className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <span className="text-xs text-neutral-400 font-poppins italic pr-2">Awaiting Results</span>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ── Detail Modal ─────────────────────────────────────────────────────────────

function LabDetailModal({ lab, onClose }: { lab: LabResult; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-archivo font-bold text-neutral-900">{lab.testName}</h2>
                        <p className="text-sm text-neutral-500 font-poppins mt-0.5">Requested on {formatDate(lab.requestedAt)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Patient Info */}
                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 font-bold font-archivo">
                            {lab.patient?.firstName?.[0]}{lab.patient?.lastName?.[0]}
                        </div>
                        <div>
                            <p className="font-bold font-archivo text-neutral-900">{lab.patient?.firstName} {lab.patient?.lastName}</p>
                            <p className="text-sm font-poppins text-neutral-500">Patient ID: #{lab.patientId}</p>
                        </div>
                    </div>

                    {/* Result Details */}
                    {lab.status === LabResultStatus.COMPLETED ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                                <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-green-900 font-poppins">Results Available</p>
                                    <p className="text-xs text-green-700 font-poppins mt-0.5">Uploaded on {lab.resultDate ? formatDate(lab.resultDate) : 'Recently'}</p>
                                </div>
                                <button 
                                    onClick={() => window.open(lab.filePath, '_blank')}
                                    className="ml-auto px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                                >
                                    <FiDownload className="w-3 h-3" /> Report
                                </button>
                            </div>

                            {lab.notes && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-2">Patient's Notes</p>
                                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-sm text-neutral-700 font-poppins leading-relaxed">
                                        {lab.notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiClock className="w-8 h-8" />
                            </div>
                            <p className="font-bold font-archivo text-neutral-900">Result Pending</p>
                            <p className="text-sm text-neutral-500 font-poppins mt-1">The patient has not uploaded the results for this test yet.</p>
                        </div>
                    )}

                    {/* Request Details */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-3">Request Details</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter">Recommended Hospital</p>
                                <p className="text-sm font-semibold text-neutral-700 mt-0.5">{lab.recommendedHospital || 'Any diagnostic center'}</p>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter">Due Date</p>
                                <p className="text-sm font-semibold text-neutral-700 mt-0.5">{lab.dateDue ? formatDate(lab.dateDue) : 'As soon as possible'}</p>
                            </div>
                        </div>
                        {lab.instructions && (
                            <div className="mt-4 p-3 bg-primary-50/50 border border-primary-100 rounded-xl">
                                <p className="text-[10px] text-primary-600 uppercase font-bold tracking-tighter">Instructions</p>
                                <p className="text-sm text-neutral-700 mt-1 font-poppins italic leading-snug">{lab.instructions}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-neutral-100 bg-neutral-50 shrink-0">
                    <button onClick={onClose} className="w-full py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-poppins font-semibold hover:bg-neutral-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

function DoctorLabs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<LabResultStatus | 'all'>('all');
    const [selectedLab, setSelectedLab] = useState<LabResult | null>(null);

    const { data: labResults = [], isLoading } = useLabResults();

    const filteredLabs = labResults.filter(lab => {
        const matchesSearch = 
            lab.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lab.patient?.firstName + " " + lab.patient?.lastName).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lab.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Laboratory Requests</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    Monitor and review all laboratory tests you've requested for your patients.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                    { label: "Total Requests", value: labResults.length, icon: FiActivity, color: "blue" },
                    { label: "Pending", value: labResults.filter(l => l.status === LabResultStatus.REQUESTED || l.status === LabResultStatus.PENDING).length, icon: FiClock, color: "amber" },
                    { label: "Completed", value: labResults.filter(l => l.status === LabResultStatus.COMPLETED).length, icon: FiCheckCircle, color: "green" },
                    { label: "Reports Viewable", value: labResults.filter(l => l.status === LabResultStatus.COMPLETED && l.filePath).length, icon: FiEye, color: "primary" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-poppins text-neutral-500">{stat.label}</p>
                            <p className="text-2xl font-archivo font-bold text-neutral-900">{isLoading ? "—" : stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by test name or patient..."
                            className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                            <FiFilter className="text-neutral-400 w-4 h-4" />
                            <select 
                                className="bg-transparent text-sm font-poppins font-semibold text-neutral-700 outline-none pr-2 cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                            >
                                <option value="all">All Status</option>
                                <option value={LabResultStatus.REQUESTED}>Requested</option>
                                <option value={LabResultStatus.PENDING}>Pending</option>
                                <option value={LabResultStatus.COMPLETED}>Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-poppins min-w-[800px]">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date Requested</th>
                                <th className="px-6 py-4 font-semibold">Test & Patient</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Target Details</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-10 rounded-lg bg-neutral-100 animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredLabs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-neutral-400">
                                            <FiActivity className="w-12 h-12 mb-3 text-neutral-300" />
                                            <p className="text-sm">No laboratory requests found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLabs.map((lab) => (
                                    <LabResultRow 
                                        key={lab.id} 
                                        lab={lab} 
                                        onView={() => setSelectedLab(lab)} 
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedLab && (
                <LabDetailModal lab={selectedLab} onClose={() => setSelectedLab(null)} />
            )}
        </div>
    );
}

export default DoctorLabs;
