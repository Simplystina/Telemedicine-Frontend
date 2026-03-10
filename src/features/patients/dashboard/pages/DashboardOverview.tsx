import { Link } from "react-router-dom";
import { FiCalendar, FiVideo, FiFileText, FiMessageSquare, FiTrendingUp, FiClock, FiStar} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";

function DashboardOverview() {
    // ---- MOCK SUBSCRIPTION STATE ----
    const isSubscribed: boolean = true;
    const freeConsultationsRemaining: number = 1;
    // ---------------------------------

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
                    Welcome back, Jane Doe! Here is a summary of your recent activities and upcoming schedule.
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
                                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold font-poppins rounded-full">
                                    Confirmed
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                    <div className="w-14 h-14 bg-white border border-neutral-200 rounded-full flex items-center justify-center shrink-0">
                                        <FaUserDoctor className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold font-poppins text-neutral-900">Dr. Sarah Jenkins</h3>
                                        <p className="text-sm font-poppins text-neutral-500">Cardiologist</p>
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-base font-bold font-poppins text-neutral-900">Oct 24, 2023</p>
                                    <p className="text-sm font-poppins text-neutral-500 flex items-center md:justify-end mt-1">
                                        <FiClock className="mr-1" /> 10:00 AM - 10:30 AM
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-poppins font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <FiVideo className="w-4 h-4 mr-2" />
                                    Join Call
                                </button>
                                <button className="flex-1 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-poppins font-semibold py-2.5 rounded-lg transition-colors">
                                    Reschedule
                                </button>
                            </div>
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

                    {/* Active Prescriptions Widget */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-archivo font-bold text-neutral-900">Current Medications</h2>
                            <Link to="/patient/records" className="text-sm font-poppins font-semibold text-primary-500 hover:text-primary-600">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 hover:bg-neutral-50 rounded-lg transition-colors border border-transparent hover:border-neutral-100">
                                <div>
                                    <p className="font-bold font-poppins text-sm text-neutral-900">Amoxicillin</p>
                                    <p className="text-xs font-poppins text-neutral-500">500mg • Twice daily</p>
                                </div>
                                <button className="text-xs font-poppins font-semibold bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors">
                                    Refill
                                </button>
                            </div>
                            <div className="flex justify-between items-center p-3 hover:bg-neutral-50 rounded-lg transition-colors border border-transparent hover:border-neutral-100">
                                <div>
                                    <p className="font-bold font-poppins text-sm text-neutral-900">Lisinopril</p>
                                    <p className="text-xs font-poppins text-neutral-500">10mg • Once daily</p>
                                </div>
                                <button className="text-xs font-poppins font-semibold bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors">
                                    Refill
                                </button>
                            </div>
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
