import { useState } from "react";
import { FiDownload, FiEye, FiFileText, FiFilter, FiSearch, FiActivity, FiFilePlus, FiMapPin } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import UploadDocumentModal from "../components/UploadDocumentModal";

// --- Types ---
interface HealthRecord {
    id: string;
    date: string;
    title: string;
    type: string;
    doctor: string;
    status: string;
    facilityName: string;
    state: string;
    address: string;
}

// Mock Data
const MOCK_RECORDS: HealthRecord[] = [
    {
        id: "rec-1",
        date: "Oct 24, 2023",
        title: "Complete Blood Count (CBC)",
        type: "Lab Result",
        doctor: "Dr. Sarah Jenkins",
        status: "Reviewed",
        facilityName: "Mercy General Hospital",
        state: "CA",
        address: "4001 J St, Sacramento, CA 95819",
    },
    {
        id: "rec-2",
        date: "Oct 10, 2023",
        title: "Chest X-Ray Report",
        type: "Imaging",
        doctor: "Dr. Marcus Johnson",
        status: "Reviewed",
        facilityName: "Valley Imaging Center",
        state: "CA",
        address: "1234 Imaging Blvd, Los Angeles, CA 90001",
    },
    {
        id: "rec-3",
        date: "Sep 15, 2023",
        title: "Visit Summary & Notes",
        type: "Doctor Note",
        doctor: "Dr. Emily Clark",
        status: "Available",
        facilityName: "Oak Clinical Associates",
        state: "NY",
        address: "100 Medical Plaza, New York, NY 10001",
    },
    {
        id: "rec-4",
        date: "Aug 02, 2023",
        title: "Dermatology Consultation",
        type: "Doctor Note",
        doctor: "Dr. David Chen",
        status: "Available",
        facilityName: "ClearSkin Dermatology",
        state: "TX",
        address: "500 Clear Way, Austin, TX 78701",
    },
    {
        id: "rec-5",
        date: "Jul 20, 2023",
        title: "Annual Comprehensive Metabolic Panel",
        type: "Lab Result",
        doctor: "Dr. Sarah Jenkins",
        status: "Reviewed",
        facilityName: "Quest Diagnostics",
        state: "CA",
        address: "1550 Quest Ln, San Diego, CA 92101",
    }
];

function HealthRecords() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const filteredRecords = MOCK_RECORDS.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Health Records</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        Securely view and manage your medical history, test results, and after-visit summaries.
                    </p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center justify-center shrink-0 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors shadow-sm"
                >
                    <FiFilePlus className="mr-2" /> Upload Record
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FiActivity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-poppins text-neutral-500">Lab Results</p>
                        <p className="text-2xl font-archivo font-bold text-neutral-900">12</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <FaUserDoctor className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-poppins text-neutral-500">Doctor Notes</p>
                        <p className="text-2xl font-archivo font-bold text-neutral-900">8</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <FiFileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-poppins text-neutral-500">Prescriptions</p>
                        <p className="text-2xl font-archivo font-bold text-neutral-900">5</p>
                    </div>
                </div>
            </div>

            {/* Records List Container */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {/* Search and Filter */}
                <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by title, requested by, facility, or type..."
                            className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-poppins text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center justify-center px-5 py-2.5 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-700 font-poppins text-sm font-semibold shrink-0">
                        <FiFilter className="mr-2 text-neutral-500" /> Filter
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-poppins min-w-[1000px]">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Document Title</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Facility</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Requested By</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-neutral-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                            {record.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                                    <FiFileText className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                                                    {record.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-700">
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-800 font-semibold">
                                            {record.facilityName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            <span className="flex items-center">
                                                <FiMapPin className="w-4 h-4 mr-1.5 text-neutral-400 shrink-0" />
                                                <span className="truncate max-w-[200px]" title={record.address}>{record.address}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                            {record.doctor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end space-x-2">
                                                {/* Doctor Notes: view is on Appointments page */}
                                                <button
                                                    className="p-2 text-neutral-300 cursor-not-allowed rounded-lg"
                                                    title={record.type === "Doctor Note" ? "View notes via My Appointments" : "View document"}
                                                    disabled
                                                >
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Download PDF">
                                                    <FiDownload className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-neutral-400">
                                            <FiFileText className="w-12 h-12 mb-3 text-neutral-300" />
                                            <p className="text-sm">No health records found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Document Modal */}
            <UploadDocumentModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
            />
        </div>
    );
}

export default HealthRecords;

