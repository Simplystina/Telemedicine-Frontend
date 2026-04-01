import { FiSearch, FiFilter, FiMoreVertical, FiCheckCircle, FiXCircle, FiAlertCircle, FiMail } from "react-icons/fi";
import { useState } from "react";

const USERS = [
    { id: "u1", name: "Dr. Sarah Johnson", role: "Doctor", specialty: "Cardiology", email: "sarah.j@med.com", status: "Pending Verification", joinDate: "Mar 30, 2026" },
    { id: "u2", name: "John Carter", role: "Patient", email: "j.carter@email.com", status: "Active", joinDate: "Mar 28, 2026" },
    { id: "u3", name: "Dr. Michael Chen", role: "Doctor", specialty: "Neurology", email: "m.chen@med.com", status: "Active", joinDate: "Mar 25, 2026" },
    { id: "u4", name: "Emily Davis", role: "Patient", email: "emily.d@email.com", status: "Suspended", joinDate: "Mar 20, 2026" },
    { id: "u5", name: "Dr. Elena Rossi", role: "Doctor", specialty: "Pediatrics", email: "e.rossi@med.com", status: "Pending Verification", joinDate: "Mar 28, 2026" },
];

function AdminUserManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter] = useState("All");

    const filteredUsers = USERS.filter(u =>
        (filter === "All" || u.role === filter || u.status === filter) &&
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">User Registry</h1>
                    <p className="text-neutral-600 font-poppins text-sm">Moderate and manage platform participants.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 flex items-center w-72 shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <FiSearch className="text-neutral-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            placeholder="Find by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-poppins text-neutral-900 w-full placeholder:text-neutral-400"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-neutral-200 text-neutral-500 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm">
                        <FiFilter className="w-5 h-5" />
                    </button>
                    <button className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-poppins font-semibold text-sm transition-colors shadow-sm">
                        Export Registry
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50">
                                <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">User / Role</th>
                                <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider">Enrolled</th>
                                <th className="px-6 py-4 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-archivo text-sm shrink-0 ${
                                                user.role === 'Doctor' ? 'bg-blue-100 text-blue-600' : 'bg-primary-100 text-primary-700'
                                            }`}>
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">{user.name}</p>
                                                <span className={`text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full ${
                                                    user.role === 'Doctor'
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'bg-primary-50 text-primary-600'
                                                }`}>
                                                    {user.role === 'Doctor' ? user.specialty : 'Patient'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm font-poppins text-neutral-600">
                                            <FiMail className="mr-2 text-neutral-400 shrink-0" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.status === 'Active' ? (
                                            <span className="inline-flex items-center text-xs font-bold font-poppins text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                                                <FiCheckCircle className="mr-1.5" /> Active
                                            </span>
                                        ) : user.status === 'Pending Verification' ? (
                                            <span className="inline-flex items-center text-xs font-bold font-poppins text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                                                <FiAlertCircle className="mr-1.5" /> Pending
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-xs font-bold font-poppins text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                                                <FiXCircle className="mr-1.5" /> Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-poppins text-neutral-600">{user.joinDate}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {user.status === 'Pending Verification' && (
                                                <button className="px-3 py-1.5 bg-primary-50 text-primary-600 border border-primary-100 rounded-lg text-xs font-semibold font-poppins hover:bg-primary-500 hover:text-white transition-colors">
                                                    Approve
                                                </button>
                                            )}
                                            <button className="p-2 bg-white border border-neutral-200 text-neutral-400 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                                                <FiMoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-sm font-poppins text-neutral-500">
                    <p>Showing {filteredUsers.length} of 12,482 entries</p>
                    <div className="flex items-center space-x-1">
                        <button className="px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-white disabled:opacity-40 text-xs font-semibold" disabled>Prev</button>
                        <button className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-semibold shadow-sm">1</button>
                        <button className="px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-white text-xs font-semibold">2</button>
                        <button className="px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-white text-xs font-semibold">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUserManagement;
