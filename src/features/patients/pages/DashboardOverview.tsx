import { Link, useNavigate } from "react-router-dom";
import { FiCalendar, FiVideo, FiFileText, FiMessageSquare, FiTrendingUp, FiClock, FiStar, FiActivity, FiMapPin } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { usePatientProfile } from "@/features/patients/hooks/usePatient";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { usePrescriptions } from "@/features/prescriptions/hooks/usePrescriptions";
import { useLabResults } from "@/features/labs/hooks/useLabs";
import { LabResultStatus } from "@/types";

function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

function to12h(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

function canJoinCall(date: string, startTime: string): boolean {
    try {
        const normalizedDate = date.includes('T') ? date.split('T')[0] : date;
        const normalizedTime = startTime.split(':').slice(0, 2).join(':');
        const appointmentStart = new Date(`${normalizedDate}T${normalizedTime}:00`);
        if (isNaN(appointmentStart.getTime())) return false;
        const openAt = new Date(appointmentStart.getTime() - 10 * 60 * 1000);
        return new Date() >= openAt;
    } catch (e) {
        return false;
    }
}

function DashboardOverview() {
    const navigate = useNavigate();
    // ---- MOCK SUBSCRIPTION STATE ----
    const isSubscribed: boolean = true;
    const freeConsultationsRemaining: number = 1;
    // ---------------------------------

    const { data: profile } = usePatientProfile();
    const authUser = useAuthStore(state => state.user);
    const displayName = [profile?.firstName ?? authUser?.firstName, profile?.lastName ?? authUser?.lastName].filter(Boolean).join(' ') || 'there';

    const { data: apptData } = useAppointments();
    const { data: prescriptions = [], isLoading: isLoadingRx } = usePrescriptions();
    const { data: labResults = [], isLoading: isLoadingLabs } = useLabResults();

    const pendingLabs = labResults.filter(l => l.status === LabResultStatus.REQUESTED || l.status === LabResultStatus.PENDING);

    // Flatten all medications from all prescriptions, most recent first
    const allMedications = prescriptions
        .slice()
        .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
        .flatMap(rx => rx.medications)
        .slice(0, 3);
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const nextAppointment = (apptData?.appointments ?? [])
        .filter(a => a.status === 'confirmed' || a.status === 'pending')
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))[0];

    const nextDoctorName = nextAppointment
        ? (() => {
            const parts = [nextAppointment.doctor?.firstName, nextAppointment.doctor?.lastName].filter(Boolean);
            const n = parts.join(' ') || 'Doctor';
            return n.startsWith('Dr.') ? n : `Dr. ${n}`;
          })()
        : null;
    const nextSpecialty = nextAppointment?.doctor?.specialty?.name ?? '';
    const nextDate = nextAppointment ? formatDate(nextAppointment.date) : '';
    const nextTime = nextAppointment
        ? `${to12h(nextAppointment.startTime)} - ${to12h(nextAppointment.endTime)}`
        : '';

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* Subscription Context Banner */}
            {!isSubscribed && (
                <div className={`rounded-xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${freeConsultationsRemaining > 0 ? 'bg-green-50 border-green-200' : 'bg-primary-50 border-primary-200'}`}>
                    <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${freeConsultationsRemaining > 0 ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'}`}>
                            {freeConsultationsRemaining > 0 ? <FiStar className="w-5 h-5 fill-current" /> : <FiClock className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className={`text-base font-archivo font-bold ${freeConsultationsRemaining > 0 ? 'text-green-900' : 'text-primary-900'}`}>
                                {freeConsultationsRemaining > 0 ? "1 Free Consultation Available" : "Unlock Unlimited Access"}
                            </h3>
                            <p className={`text-sm font-poppins mt-1 ${freeConsultationsRemaining > 0 ? 'text-green-800' : 'text-primary-800'}`}>
                                {freeConsultationsRemaining > 0
                                    ? "Experience our premium care with one complimentary session before subscribing."
                                    : "You've used your free consultation. Subscribe to continue booking appointments."}
                            </p>
                        </div>
                    </div>

                    <Link
                        to={freeConsultationsRemaining > 0 ? "/patient/browse-doctors" : "/patient/subscription"}
                        className={`shrink-0 px-6 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-colors ${freeConsultationsRemaining > 0
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-primary-600 hover:bg-primary-700 text-white"
                            }`}
                    >
                        {freeConsultationsRemaining > 0 ? "Find a Doctor" : "View Plans"}
                    </Link>
                </div>
            )}

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Dashboard Overview</h1>
                <p className="text-neutral-600 font-poppins text-sm">
                    Welcome back, {displayName}! Here is a summary of your recent activities and upcoming schedule.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Main Actions & Appointments (Takes up 2/3 on desktop) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Action Card: Upcoming Appointment */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden relative">
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-archivo font-bold text-neutral-900 flex items-center">
                                    <FiCalendar className="mr-2 text-primary-500" />
                                    Upcoming Appointment
                                </h2>
                                {nextAppointment && (
                                    <span className={`px-3 py-1 text-xs font-bold font-poppins rounded-full ${nextAppointment.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                        {nextAppointment.status.charAt(0).toUpperCase() + nextAppointment.status.slice(1)}
                                    </span>
                                )}
                            </div>

                            {nextAppointment ? (
                                <>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                            <div className="w-14 h-14 bg-white border border-neutral-200 rounded-full flex items-center justify-center shrink-0">
                                                <FaUserDoctor className="w-6 h-6 text-primary-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold font-poppins text-neutral-900">{nextDoctorName}</h3>
                                                <p className="text-sm font-poppins text-neutral-500">{nextSpecialty}</p>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-base font-bold font-poppins text-neutral-900">{nextDate}</p>
                                            <p className="text-sm font-poppins text-neutral-500 flex items-center md:justify-end mt-1">
                                                <FiClock className="mr-1" /> {nextTime}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={() => canJoinCall(nextAppointment.date, nextAppointment.startTime) && navigate(`/patient/call/${nextAppointment.id}`)}
                                            disabled={!canJoinCall(nextAppointment.date, nextAppointment.startTime)}
                                            title={canJoinCall(nextAppointment.date, nextAppointment.startTime) ? undefined : "Available 10 minutes before the appointment"}
                                            className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-poppins font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <FiVideo className="w-4 h-4 mr-2" />
                                            Join Call
                                        </button>
                                        <Link
                                            to="/patient/appointments"
                                            className="flex-1 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-poppins font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            Reschedule
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-neutral-400 font-poppins text-sm">
                                    No upcoming appointments.{' '}
                                    <Link to="/patient/browse-doctors" className="text-primary-500 font-semibold hover:text-primary-600">
                                        Find a doctor
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div>
                        <h2 className="text-lg font-archivo font-bold text-neutral-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link to="/patient/browse-doctors" className="group bg-white p-5 rounded-xl border border-neutral-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <FaUserDoctor className="w-5 h-5" />
                                </div>
                                <span className="font-poppins text-sm font-semibold text-neutral-700">Find Doctor</span>
                            </Link>

                            <Link to="/patient/records" className="group bg-white p-5 rounded-xl border border-neutral-200 shadow-sm hover:border-secondary-500 hover:shadow-md transition-all flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-secondary-50 text-secondary-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <span className="font-poppins text-sm font-semibold text-neutral-700">Records</span>
                            </Link>

                            <button className="group bg-white p-5 rounded-xl border border-neutral-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <FiTrendingUp className="w-5 h-5" />
                                </div>
                                <span className="font-poppins text-sm font-semibold text-neutral-700">Log Vitals</span>
                            </button>

                            <Link to="/patient/messages" className="group bg-white p-5 rounded-xl border border-neutral-200 shadow-sm hover:border-green-500 hover:shadow-md transition-all flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <FiMessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-poppins text-sm font-semibold text-neutral-700">Message</span>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Column 2: Side Widgets (Takes up 1/3 on desktop) */}
                <div className="space-y-6">

                    {/* Pending Lab Orders Widget */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-archivo font-bold text-neutral-900 flex items-center">
                                <FiActivity className="mr-2 text-primary-500" /> Lab Orders
                            </h2>
                            <Link to="/patient/records" className="text-sm font-poppins font-semibold text-primary-500 hover:text-primary-600">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {isLoadingLabs ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="h-14 rounded-lg bg-neutral-100 animate-pulse" />
                                ))
                            ) : pendingLabs.length === 0 ? (
                                <p className="text-sm font-poppins text-neutral-400 text-center py-4">No pending lab tests.</p>
                            ) : (
                                pendingLabs.map((lab, i) => (
                                    <div key={i} className="p-4 bg-primary-50/50 border border-primary-100 rounded-xl group hover:bg-primary-50 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-neutral-900">{lab.testName}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                                                {lab.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-col space-y-1 mb-3">
                                            {lab.recommendedHospital && (
                                                <div className="flex items-center text-[11px] text-neutral-600 font-poppins">
                                                    <FiMapPin className="mr-1 text-primary-400 w-3 h-3" />
                                                    {lab.recommendedHospital}
                                                </div>
                                            )}
                                            {lab.dateDue && (
                                                <div className="flex items-center text-[11px] text-neutral-600 font-poppins">
                                                    <FiClock className="mr-1 text-primary-400 w-3 h-3" />
                                                    Due: {new Date(lab.dateDue).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            to="/patient/records"
                                            className="w-full py-2 bg-white border border-primary-200 text-primary-600 hover:bg-primary-50 rounded-lg text-xs font-bold font-poppins flex items-center justify-center transition-colors"
                                        >
                                            Pay & Upload Result
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Active Prescriptions Widget */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-archivo font-bold text-neutral-900">Current Medications</h2>
                            <Link to="/patient/records" className="text-sm font-poppins font-semibold text-primary-500 hover:text-primary-600">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {isLoadingRx ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="h-14 rounded-lg bg-neutral-100 animate-pulse" />
                                ))
                            ) : allMedications.length === 0 ? (
                                <p className="text-sm font-poppins text-neutral-400 text-center py-4">No active medications.</p>
                            ) : (
                                allMedications.map((med, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 hover:bg-neutral-50 rounded-lg transition-colors border border-transparent hover:border-neutral-100">
                                        <div>
                                            <p className="font-bold font-poppins text-sm text-neutral-900">{med.name}</p>
                                            <p className="text-xs font-poppins text-neutral-500">
                                                {med.dosage}{med.unit} • {med.frequency}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Vitals Summary Widget */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h2 className="text-lg font-archivo font-bold text-neutral-900 mb-5">Recent Vitals</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-poppins text-xs text-neutral-500">Heart Rate</p>
                                        <p className="font-bold font-poppins text-neutral-900">72 bpm</p>
                                    </div>
                                </div>
                                <span className="text-xs font-poppins font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Normal</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-poppins text-xs text-neutral-500">Blood Pressure</p>
                                        <p className="font-bold font-poppins text-neutral-900">120/80</p>
                                    </div>
                                </div>
                                <span className="text-xs font-poppins font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Normal</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DashboardOverview;
