import {
    FiActivity, FiUsers, FiShield,
    FiAlertTriangle, FiServer, FiGlobe,
    FiCalendar, FiCheckCircle, FiGrid
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from "@/features/admin/hooks/useAdmin";

const colorMap: Record<string, { iconBg: string; text: string }> = {
    primary: { iconBg: "bg-primary-100", text: "text-primary-600" },
    blue: { iconBg: "bg-blue-100", text: "text-blue-600" },
    green: { iconBg: "bg-green-100", text: "text-green-600" },
    amber: { iconBg: "bg-amber-100", text: "text-amber-600" },
};

function AdminDashboard() {
    const { data: stats, isLoading } = useAdminDashboard();
    const navigate = useNavigate();

    const statCards = [
        { label: "Total Users", value: stats?.users.total, icon: FiUsers, color: "blue", href: "/admin/patients" },
        { label: "Verified Doctors", value: stats?.doctors.verified, icon: FiShield, color: "green", href: "/admin/doctors" },
        { label: "Pending Review", value: stats?.doctors.pending, icon: FiAlertTriangle, color: "amber", href: "/admin/doctors?status=pending" },
        { label: "Specialties", value: stats?.specialties.total, icon: FiGrid, color: "primary", href: "/admin/specialties" },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Platform Overview 📊</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    Real-time monitoring and administrative control for Dr. Malik Telemedicine.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    const colors = colorMap[stat.color];
                    return (
                        <div
                            key={stat.label}
                            onClick={() => navigate(stat.href)}
                            className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 flex items-center space-x-4 cursor-pointer hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                                <Icon className={`w-6 h-6 ${colors.text}`} />
                            </div>
                            <div>
                                <p className="text-xs font-poppins text-neutral-500">{stat.label}</p>
                                <p className="text-xl font-archivo font-bold text-neutral-900">
                                    {isLoading ? "—" : (stat.value ?? "—")}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Platform Health */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-archivo font-bold text-neutral-900 flex items-center">
                                <FiActivity className="mr-2 text-primary-500" />
                                Infrastructure Health
                            </h2>
                            <select className="text-xs font-poppins font-semibold text-neutral-500 border border-neutral-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary-300 bg-white">
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>

                        {/* Bar Chart */}
                        <div className="h-40 flex items-end justify-between gap-1.5 px-2 relative">
                            <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-0 pointer-events-none">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-px w-full bg-neutral-100" />)}
                            </div>
                            {[40, 55, 45, 60, 85, 75, 40, 50, 45, 60, 70, 90, 80, 55, 45, 60, 50].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        className="w-full bg-primary-100 rounded-t group-hover:bg-primary-500 transition-colors cursor-pointer"
                                        style={{ height: `${h}%` }}
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] font-bold text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-neutral-100 mt-4">
                            <div className="flex items-center space-x-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                                <FiServer className="text-blue-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-poppins text-neutral-400 uppercase tracking-widest">Clusters</p>
                                    <p className="text-xs font-poppins font-bold text-neutral-900">AWS us-east-1</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                                <FiGlobe className="text-primary-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-poppins text-neutral-400 uppercase tracking-widest">CDN</p>
                                    <p className="text-xs font-poppins font-bold text-neutral-900">12 Nodes</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 p-3 rounded-xl bg-green-50 border border-green-100">
                                <FiShield className="text-green-600 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-poppins text-green-600 uppercase tracking-widest">Firewall</p>
                                    <p className="text-xs font-poppins font-bold text-green-700">Protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor Status Summary */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    <h2 className="text-lg font-archivo font-bold text-neutral-900 flex items-center mb-5">
                        <FiShield className="mr-2 text-primary-500" />
                        Doctor Status
                    </h2>

                    <div className="space-y-3">
                        {[
                            { label: "Verified", value: stats?.doctors.verified, color: "bg-green-100 text-green-700", dot: "bg-green-500" },
                            { label: "Pending Review", value: stats?.doctors.pending, color: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
                            { label: "Suspended", value: stats?.doctors.suspended, color: "bg-red-100 text-red-700", dot: "bg-red-500" },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                                <div className="flex items-center space-x-3">
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                                    <p className="text-sm font-semibold font-poppins text-neutral-900">{item.label}</p>
                                </div>
                                <span className={`text-xs font-bold font-poppins px-2.5 py-1 rounded-full ${item.color}`}>
                                    {isLoading ? "—" : (item.value ?? "—")}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-poppins text-neutral-500">
                        <span>Total doctors</span>
                        <span className="font-bold text-neutral-900">{isLoading ? "—" : (stats?.doctors.total ?? "—")}</span>
                    </div>
                </div>
            </div>

            {/* System Checks */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <h2 className="text-lg font-archivo font-bold text-neutral-900 mb-4 flex items-center">
                    <FiCalendar className="mr-2 text-primary-500" />
                    System Health Checks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "API Gateway", status: "Operational", ok: true },
                        { label: "Database Cluster", status: "Operational", ok: true },
                        { label: "Pending Reviews", status: "3 Items", ok: false },
                    ].map((check, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                            <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-700">
                                <FiCheckCircle className={`w-4 h-4 ${check.ok ? 'text-green-500' : 'text-amber-500'}`} />
                                <span>{check.label}</span>
                            </div>
                            <span className={`text-xs font-bold font-poppins px-2 py-1 rounded ${check.ok ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                                {check.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
