import { useState } from "react";
import {
    FiSearch, FiActivity, FiMapPin, FiClock, FiEye, FiUploadCloud
} from "react-icons/fi";
import { useLabResults } from "@/features/labs/hooks/useLabs";
import { LabResultStatus } from "@/types";
import type { LabResult } from "@/types";
import UploadDocumentModal from "../components/UploadDocumentModal";

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

// ── Lab Result Row ───────────────────────────────────────────────────────────

function LabResultRow({ lab, onUpload }: {
    lab: LabResult;
    onUpload: () => void;
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
                            Requested by: <span className="font-semibold text-neutral-700">Dr. {lab.doctor?.lastName || 'Medical Team'}</span>
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
                    {isPending ? (
                        <button
                            onClick={onUpload}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-xs font-bold font-poppins"
                        >
                            <FiUploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Result</span>
                        </button>
                    ) : isCompleted ? (
                        <button
                            onClick={() => window.open(lab.filePath, '_blank')}
                            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Result"
                        >
                            <FiEye className="w-5 h-5" />
                        </button>
                    ) : null}
                </div>
            </td>
        </tr>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

function PatientLabs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedLabOrder, setSelectedLabOrder] = useState<LabResult | null>(null);

    const { data: labResults = [], isLoading } = useLabResults();

    const filteredLabs = labResults.filter(lab => 
        lab.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.doctor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">My Lab Results</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        Access your diagnostic requests and upload results from your medical team.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Tests", value: labResults.length, icon: FiActivity, color: "blue" },
                    { label: "Pending Upload", value: labResults.filter(l => l.status === LabResultStatus.REQUESTED || l.status === LabResultStatus.PENDING).length, icon: FiClock, color: "amber" },
                    { label: "Completed", value: labResults.filter(l => l.status === LabResultStatus.COMPLETED).length, icon: FiEye, color: "green" },
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

            {/* List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by test name or doctor..."
                            className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-poppins min-w-[800px]">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date Requested</th>
                                <th className="px-6 py-4 font-semibold">Test Name</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Location & Deadline</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
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
                                            <p className="text-sm">No lab orders found. Complete a consultation to receive lab requests.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLabs.map((lab) => (
                                    <LabResultRow 
                                        key={lab.id} 
                                        lab={lab} 
                                        onUpload={() => {
                                            setSelectedLabOrder(lab);
                                            setIsUploadOpen(true);
                                        }}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UploadDocumentModal
                isOpen={isUploadOpen}
                onClose={() => {
                    setIsUploadOpen(false);
                    setSelectedLabOrder(null);
                }}
                labResult={selectedLabOrder}
            />
        </div>
    );
}

export default PatientLabs;
