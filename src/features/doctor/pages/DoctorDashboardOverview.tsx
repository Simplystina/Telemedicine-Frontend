import { Link } from "react-router-dom";
import {
    FiCalendar, FiUsers, FiMessageSquare,
    FiClock, FiVideo, FiCheckCircle, FiAlertCircle, FiActivity, FiShield
} from "react-icons/fi";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useLabResults } from "@/features/labs/hooks/useLabs";
import { useMyDoctorProfile, useMyAvailability } from "@/features/doctor/hooks/useDoctors";

function to12h(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    primary: { bg: "bg-primary-50", text: "text-primary-600", iconBg: "bg-primary-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
    green: { bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
    secondary: { bg: "bg-pink-50", text: "text-pink-600", iconBg: "bg-pink-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", iconBg: "bg-amber-100" },
};

function DoctorDashboardOverview() {
    const { user } = useAuthStore();
    const { data: apptData, isLoading } = useAppointments();
    const { data: labResults = [], isLoading: labsLoading } = useLabResults();
    const { data: profile } = useMyDoctorProfile();
    const { data: availability = [] } = useMyAvailability();

    const today = new Date().toISOString().slice(0, 10);
    const allAppointments = apptData?.appointments ?? [];
    const todayAppointments = allAppointments
        .filter(a => a.date === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const uniquePatientCount = new Set(allAppointments.map(a => a.patient?.id ?? a.patientId)).size;
    const pendingLabCount = labResults.filter(l => l.status !== 'completed').length;
    const pendingNotesCount = allAppointments.filter(a => a.status === 'completed').length;

    const profileComplete = !!(profile?.firstName && profile?.lastName && profile?.specialty && profile?.hospital);
    const availabilitySet = availability.length > 0;

    const doctorDisplayName = user?.firstName ? `Dr. ${user.firstName}` : 'Doctor';

    const statCards = [
        { label: "Today's Appointments", value: isLoading ? '—' : String(todayAppointments.length), icon: FiCalendar, color: "primary", change: "scheduled for today" },
        { label: "Total Patients", value: isLoading ? '—' : String(uniquePatientCount), icon: FiUsers, color: "blue", change: "across all appointments" },
        { label: "Pending Lab Results", value: labsLoading ? '—' : String(pendingLabCount), icon: FiActivity, color: "amber", change: "awaiting uploads" },
        { label: "Completed Appointments", value: isLoading ? '—' : String(allAppointments.filter(a => a.status === 'completed').length), icon: FiMessageSquare, color: "secondary", change: "total completed" },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Welcome back, {doctorDisplayName}</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    Here's your practice overview for today.
                </p>
            </div>

            {/* Account status banner */}
            {profile?.status && profile.status !== 'verified' && (
                <div className={`flex items-start gap-3 p-4 rounded-2xl border ${
                    profile.status === 'suspended'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        profile.status === 'suspended' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                        <FiShield className={`w-5 h-5 ${profile.status === 'suspended' ? 'text-red-600' : 'text-amber-600'}`} />
                    </div>
                    <div>
                        <p className={`text-sm font-bold font-poppins ${profile.status === 'suspended' ? 'text-red-900' : 'text-amber-900'}`}>
                            {profile.status === 'suspended' ? 'Account Suspended' : 'Account Pending Approval'}
                        </p>
                        <p className={`text-xs font-poppins mt-0.5 ${profile.status === 'suspended' ? 'text-red-700' : 'text-amber-700'}`}>
                            {profile.status === 'suspended'
                                ? 'Your account has been suspended. Please contact support for assistance.'
                                : 'Your account is under review. You will be notified once an admin approves your profile.'}
                        </p>
                    </div>
                </div>
            )}

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

                {/* Today's Schedule */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-500" />
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-archivo font-bold text-neutral-900 flex items-center">
                                <FiCalendar className="mr-2 text-primary-500" />
                                Today's Schedule
                            </h2>
                            <Link to="/doctor/appointments" className="text-sm font-poppins font-semibold text-primary-500 hover:text-primary-600">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
                                ))
                            ) : todayAppointments.length === 0 ? (
                                <p className="text-center text-neutral-400 font-poppins text-sm py-6">No appointments scheduled for today.</p>
                            ) : todayAppointments.map((appt) => {
                                const nameParts = [appt.patient?.firstName, appt.patient?.lastName].filter(Boolean);
                                const patientName = nameParts.join(' ') || 'Unknown Patient';
                                const initials = nameParts.map(n => n![0]).join('') || '?';
                                return (
                                    <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary-100 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-sm shrink-0">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold font-poppins text-neutral-900">{patientName}</p>
                                                <p className="text-xs font-poppins text-neutral-500 capitalize">{appt.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-semibold font-poppins text-neutral-900 flex items-center">
                                                    <FiClock className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                                                    {to12h(appt.startTime)}
                                                </p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-poppins ${appt.status === "confirmed"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-amber-50 text-amber-700"
                                                }`}>
                                                {appt.status === "confirmed" ? "Confirmed" : "Pending"}
                                            </span>
                                            <Link
                                                to={`/doctor/call/${appt.id}`}
                                                className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                                            >
                                                <FiVideo className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column Widgets */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h2 className="text-lg font-archivo font-bold text-neutral-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/doctor/availability" className="group flex flex-col items-center p-4 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors text-center">
                                <FiClock className="w-6 h-6 text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold font-poppins text-primary-800">Availability</span>
                            </Link>
                            <Link to="/doctor/patients" className="group flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-center">
                                <FiUsers className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold font-poppins text-blue-800">Patients</span>
                            </Link>
                            <Link to="/doctor/labs" className="group flex flex-col items-center p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors text-center">
                                <FiActivity className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold font-poppins text-amber-800">Lab Results</span>
                            </Link>
                            <Link to="/doctor/messages" className="group flex flex-col items-center p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors text-center">
                                <FiMessageSquare className="w-6 h-6 text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold font-poppins text-pink-800">Messages</span>
                            </Link>
                        </div>
                    </div>

                    {/* Practice Health */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h2 className="text-lg font-archivo font-bold text-neutral-900 mb-4">Practice Health</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-700">
                                    {profileComplete
                                        ? <FiCheckCircle className="w-4 h-4 text-green-500" />
                                        : <FiAlertCircle className="w-4 h-4 text-amber-500" />}
                                    <span>Profile Complete</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${profileComplete ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                                    {profileComplete ? 'Yes' : 'Incomplete'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-700">
                                    {availabilitySet
                                        ? <FiCheckCircle className="w-4 h-4 text-green-500" />
                                        : <FiAlertCircle className="w-4 h-4 text-amber-500" />}
                                    <span>Availability Set</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${availabilitySet ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                                    {availabilitySet ? 'Yes' : 'Not set'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-700">
                                    {pendingNotesCount > 0
                                        ? <FiAlertCircle className="w-4 h-4 text-amber-500" />
                                        : <FiCheckCircle className="w-4 h-4 text-green-500" />}
                                    <span>Pending Reviews</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${pendingNotesCount > 0 ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'}`}>
                                    {isLoading ? '—' : pendingNotesCount > 0 ? String(pendingNotesCount) : 'All done'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboardOverview;
