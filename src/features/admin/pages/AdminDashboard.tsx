import {
    FiActivity, FiUsers, FiShield, FiTrendingUp,
    FiAlertTriangle, FiArrowUpRight, FiServer, FiGlobe,
    FiCalendar, FiCheckCircle
} from "react-icons/fi";

const statCards = [
    { label: "Total Users", value: "12,482", icon: FiUsers, color: "blue", change: "+14% this month" },
    { label: "Verified Doctors", value: "842", icon: FiShield, color: "primary", change: "+5% growth" },
    { label: "Platform Uptime", value: "98.4%", icon: FiActivity, color: "green", change: "Optimal" },
    { label: "Revenue (ARR)", value: "$2.4M", icon: FiTrendingUp, color: "secondary", change: "+22% increase" },
];

const colorMap: Record<string, { iconBg: string; text: string }> = {
    primary: { iconBg: "bg-primary-100", text: "text-primary-600" },
    blue: { iconBg: "bg-blue-100", text: "text-blue-600" },
    green: { iconBg: "bg-green-100", text: "text-green-600" },
    secondary: { iconBg: "bg-pink-100", text: "text-pink-600" },
};

const actionQueue = [
    { user: "Dr. Sarah Johnson", action: "Pending Verification", time: "2 mins ago", type: "doctor" },
    { user: "Emergency Alert", action: "System Load > 90%", time: "5 mins ago", type: "alert" },
    { user: "John Carter", action: "Account Reconciliation", time: "12 mins ago", type: "user" },
    { user: "Dr. Michael Chen", action: "Credential Update", time: "45 mins ago", type: "doctor" },
];

function AdminDashboard() {
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
                        <div key={stat.label} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                                <Icon className={`w-6 h-6 ${colors.text}`} />
                            </div>
                            <div>
                                <p className="text-xs font-poppins text-neutral-500">{stat.label}</p>
                                <p className="text-xl font-archivo font-bold text-neutral-900">{stat.value}</p>
                                <p className={`text-[11px] font-poppins font-medium mt-0.5 ${colors.text}`}>{stat.change}</p>
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

                {/* Action Queue */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    <h2 className="text-lg font-archivo font-bold text-neutral-900 flex items-center mb-5">
                        <FiAlertTriangle className="mr-2 text-amber-500" />
                        Action Queue
                    </h2>

                    <div className="space-y-3">
                        {actionQueue.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary-100 transition-colors group cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-archivo text-sm shrink-0 ${
                                        item.type === 'alert' ? 'bg-red-100 text-red-600' :
                                        item.type === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-neutral-200 text-neutral-500'
                                    }`}>
                                        {item.type === 'alert' ? '!' : item.user.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold font-poppins text-neutral-900">{item.user}</p>
                                        <p className="text-[10px] font-poppins text-neutral-500">{item.action}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-poppins text-neutral-400">{item.time}</p>
                                    <FiArrowUpRight className="ml-auto w-3 h-3 text-neutral-300 group-hover:text-primary-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-semibold font-poppins text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                        View Full Log
                    </button>
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
