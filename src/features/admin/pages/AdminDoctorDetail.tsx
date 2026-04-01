import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FiArrowLeft, FiStar, FiCalendar, FiUsers, FiMail, FiPhone,
    FiMapPin, FiShield, FiAlertTriangle, FiCheckCircle, FiXCircle,
    FiClock, FiFileText, FiMessageSquare, FiVideo, FiActivity
} from "react-icons/fi";
import { DOCTORS } from "./AdminDoctorList";

type SidebarSection = "live" | "overview" | "availability" | "credentials" | "appointments" | "actions";

function AdminDoctorDetail() {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<SidebarSection>("live");
    const [doctorStatus, setDoctorStatus] = useState<string | null>(null);

    const doctor = DOCTORS.find(d => d.id === doctorId);

    if (!doctor) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FiAlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
                <h2 className="text-lg font-archivo font-bold text-neutral-900">Doctor Not Found</h2>
                <p className="text-sm font-poppins text-neutral-500 mt-1">This doctor may have been removed from the registry.</p>
                <button
                    onClick={() => navigate("/admin/doctors")}
                    className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg font-poppins text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                    Back to Registry
                </button>
            </div>
        );
    }

    const currentStatus = doctorStatus ?? doctor.status;

    const sidebarItems: { key: SidebarSection; label: string; icon: React.ElementType }[] = [
        { key: "live", label: "Live Status", icon: FiActivity },
        { key: "overview", label: "Profile Overview", icon: FiUsers },
        { key: "availability", label: "Availability", icon: FiClock },
        { key: "credentials", label: "Credentials", icon: FiShield },
        { key: "appointments", label: "Appointments", icon: FiCalendar },
        { key: "actions", label: "Account Actions", icon: FiFileText },
    ];

    return (
        <div className="animate-fade-in-up">
            {/* Back Button */}
            <button
                onClick={() => navigate("/admin/doctors")}
                className="flex items-center space-x-2 text-sm font-poppins font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-6"
            >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Doctor Registry</span>
            </button>

            {/* Live Consultation Banner */}
            {doctor.isInConsultation && (
                <div className="mb-6 flex items-center space-x-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                    <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold font-poppins text-green-900">
                            Currently in consultation with <span className="font-bold">{doctor.currentPatient?.name}</span>
                            <span className="text-green-600 font-normal"> · {doctor.currentPatient?.type}</span>
                        </p>
                        <p className="text-xs font-poppins text-green-600 mt-0.5">
                            Started at {doctor.currentPatient?.startedAt} · {doctor.consultationDuration} elapsed
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                        <FiVideo className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-bold font-poppins text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                            LIVE
                        </span>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">

                {/* ── LEFT: Management Sidebar ── */}
                <aside className="w-full lg:w-64 shrink-0 space-y-4">

                    {/* Doctor Card */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 text-center">
                        <div className="relative inline-block mb-3">
                            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-xl">
                                {doctor.name.split(" ").map(n => n[0]).join("").slice(1, 3)}
                            </div>
                            {/* Online dot */}
                            <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                                doctor.isInConsultation ? "bg-green-500" : currentStatus === "Active" ? "bg-blue-400" : "bg-neutral-300"
                            }`} />
                        </div>
                        <h2 className="text-base font-archivo font-bold text-neutral-900">{doctor.name}</h2>
                        <p className="text-xs font-poppins text-neutral-500 mt-0.5">{doctor.specialty}</p>
                        <span className={`inline-block mt-2 text-[11px] font-bold font-poppins px-3 py-1 rounded-full ${
                            doctor.isInConsultation
                                ? "bg-green-50 text-green-700"
                                : currentStatus === "Active" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"
                        }`}>
                            {doctor.isInConsultation ? "In Consultation" : currentStatus}
                        </span>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="p-3">
                            <p className="px-2 text-[10px] font-bold font-poppins text-neutral-400 uppercase tracking-wider mb-2">Manage</p>
                            {sidebarItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveSection(item.key)}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg font-poppins text-sm font-medium transition-colors text-left ${
                                            activeSection === item.key
                                                ? "bg-primary-50 text-primary-700 font-semibold"
                                                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 mr-3 shrink-0" />
                                        {item.label}
                                        {item.key === "live" && doctor.isInConsultation && (
                                            <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-3">
                        <p className="text-[10px] font-bold font-poppins text-neutral-400 uppercase tracking-wider">Quick Stats</p>
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center"><FiUsers className="w-4 h-4 mr-2 text-neutral-400" />Patients</span>
                            <span className="font-bold text-neutral-900">{doctor.patients}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center"><FiCalendar className="w-4 h-4 mr-2 text-neutral-400" />Appointments</span>
                            <span className="font-bold text-neutral-900">{doctor.appointments}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center"><FiStar className="w-4 h-4 mr-2 text-amber-400" />Rating</span>
                            <span className="font-bold text-neutral-900">{doctor.rating} / 5.0</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center"><FiClock className="w-4 h-4 mr-2 text-neutral-400" />Joined</span>
                            <span className="font-bold text-neutral-900">{doctor.joinDate}</span>
                        </div>
                    </div>
                </aside>

                {/* ── RIGHT: Main Content ── */}
                <div className="flex-1 min-w-0 space-y-6">

                    {/* ── LIVE STATUS PANEL ── */}
                    {activeSection === "live" && (
                        <>
                            {/* Current Consultation */}
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-4 flex items-center">
                                    <FiActivity className="mr-2 text-primary-500" />
                                    Live Activity
                                </h3>
                                {doctor.isInConsultation && doctor.currentPatient ? (
                                    <div className="flex items-center justify-between p-5 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold font-archivo text-sm shrink-0">
                                                {doctor.currentPatient.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-bold font-poppins text-neutral-900">{doctor.currentPatient.name}</p>
                                                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">LIVE</span>
                                                </div>
                                                <p className="text-xs font-poppins text-neutral-500 mt-0.5">{doctor.currentPatient.type}</p>
                                                <p className="text-xs font-poppins text-green-600 mt-0.5">
                                                    Started {doctor.currentPatient.startedAt} · {doctor.consultationDuration} in progress
                                                </p>
                                            </div>
                                        </div>
                                        <FiVideo className="w-6 h-6 text-green-500" />
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3 p-5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-500">
                                        <FiVideo className="w-5 h-5 text-neutral-300" />
                                        <div>
                                            <p className="text-sm font-semibold font-poppins text-neutral-700">No Active Consultation</p>
                                            <p className="text-xs font-poppins text-neutral-400 mt-0.5">
                                                {currentStatus === "Suspended" ? "Account is suspended." : `Next available: ${doctor.nextAvailable}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Patient Breakdown */}
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-4 flex items-center">
                                    <FiUsers className="mr-2 text-primary-500" />
                                    Patient Overview
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                                        <p className="text-2xl font-archivo font-bold text-primary-600">{doctor.patients}</p>
                                        <p className="text-xs font-poppins text-neutral-500 mt-1">Total Patients</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                                        <p className="text-2xl font-archivo font-bold text-green-600">{(doctor as any).newPatientsThisMonth}</p>
                                        <p className="text-xs font-poppins text-neutral-500 mt-1">New This Month</p>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-2xl font-archivo font-bold text-blue-600">{(doctor as any).returningPatients}</p>
                                        <p className="text-xs font-poppins text-neutral-500 mt-1">Returning</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Appointments */}
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-4 flex items-center">
                                    <FiCalendar className="mr-2 text-primary-500" />
                                    Upcoming Appointments
                                </h3>
                                {(doctor as any).upcomingAppointments.length === 0 ? (
                                    <p className="text-sm font-poppins text-neutral-400 text-center py-6">No upcoming appointments scheduled.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {(doctor as any).upcomingAppointments.map((appt: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary-100 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-xs shrink-0">
                                                        {appt.patient.split(" ").map((n: string) => n[0]).join("")}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold font-poppins text-neutral-900">{appt.patient}</p>
                                                        <p className="text-xs font-poppins text-neutral-500">{appt.type}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold font-poppins text-neutral-700">{appt.time}</p>
                                                    <p className="text-[10px] font-poppins text-neutral-400">{appt.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── PROFILE OVERVIEW ── */}
                    {activeSection === "overview" && (
                        <>
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-4">Profile Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <InfoRow icon={FiMail} label="Email" value={doctor.email} />
                                    <InfoRow icon={FiPhone} label="Phone" value={doctor.phone} />
                                    <InfoRow icon={FiMapPin} label="Location" value={doctor.location} />
                                    <InfoRow icon={FiUsers} label="Hospital" value={doctor.hospital} />
                                    <InfoRow icon={FiShield} label="Specialty" value={doctor.specialty} />
                                    <InfoRow icon={FiCalendar} label="Member Since" value={doctor.joinDate} />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-3">About</h3>
                                <p className="text-sm font-poppins text-neutral-600 leading-relaxed">{doctor.bio}</p>
                            </div>
                        </>
                    )}

                    {/* ── AVAILABILITY ── */}
                    {activeSection === "availability" && (
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                            <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-5 flex items-center">
                                <FiClock className="mr-2 text-primary-500" />
                                Availability Schedule
                            </h3>

                            {/* Hours */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl">
                                    <p className="text-[10px] font-bold font-poppins text-primary-500 uppercase tracking-wider mb-1">Working Hours</p>
                                    <p className="text-sm font-bold font-poppins text-neutral-900">{(doctor as any).availabilityHours}</p>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                    <p className="text-[10px] font-bold font-poppins text-green-600 uppercase tracking-wider mb-1">Next Available</p>
                                    <p className="text-sm font-bold font-poppins text-neutral-900">{(doctor as any).nextAvailable}</p>
                                </div>
                            </div>

                            {/* Days */}
                            <p className="text-[10px] font-bold font-poppins text-neutral-400 uppercase tracking-wider mb-3">Working Days</p>
                            <div className="flex flex-wrap gap-2">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                                    const isActive = (doctor as any).availabilityDays.includes(day);
                                    return (
                                        <div key={day} className={`px-4 py-2 rounded-xl text-sm font-bold font-poppins ${
                                            isActive
                                                ? "bg-primary-500 text-white shadow-sm"
                                                : "bg-neutral-100 text-neutral-400"
                                        }`}>
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Today's schedule */}
                            <div className="mt-6 border-t border-neutral-100 pt-5">
                                <p className="text-[10px] font-bold font-poppins text-neutral-400 uppercase tracking-wider mb-3">Today's Schedule</p>
                                {(doctor as any).upcomingAppointments.filter((a: any) => a.date === "Today").length === 0 ? (
                                    <p className="text-sm font-poppins text-neutral-400">No appointments scheduled for today.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {(doctor as any).upcomingAppointments.filter((a: any) => a.date === "Today").map((appt: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                                                <div className="flex items-center space-x-3">
                                                    <FiClock className="w-4 h-4 text-primary-400 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold font-poppins text-neutral-900">{appt.patient}</p>
                                                        <p className="text-xs font-poppins text-neutral-500">{appt.type}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold font-poppins text-neutral-700">{appt.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── CREDENTIALS ── */}
                    {activeSection === "credentials" && (
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                            <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-4">Credentials & License</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <FiCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold font-poppins text-neutral-900">Medical License</p>
                                            <p className="text-xs font-poppins text-neutral-500">{doctor.licenseNo}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold font-poppins text-green-700 bg-green-100 px-2 py-1 rounded-full">Verified</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <FiFileText className="w-5 h-5 text-neutral-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold font-poppins text-neutral-900">Board Certification</p>
                                            <p className="text-xs font-poppins text-neutral-500">{doctor.specialty} Board — 2021</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold font-poppins text-green-700 bg-green-100 px-2 py-1 rounded-full">Valid</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <FiFileText className="w-5 h-5 text-neutral-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold font-poppins text-neutral-900">Malpractice Insurance</p>
                                            <p className="text-xs font-poppins text-neutral-500">Expires Dec 2026</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold font-poppins text-amber-700 bg-amber-50 px-2 py-1 rounded-full">Expiring</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── APPOINTMENTS HISTORY ── */}
                    {activeSection === "appointments" && (
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                            <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-4">Appointment History</h3>
                            <div className="space-y-3">
                                {[
                                    { patient: "Jane Doe", type: "Follow-up", date: "Mar 31, 2026", status: "Completed" },
                                    { patient: "Emeka Eze", type: "New Consultation", date: "Mar 30, 2026", status: "Completed" },
                                    { patient: "Aisha Bello", type: "Routine Check", date: "Mar 28, 2026", status: "Completed" },
                                    { patient: "Chidi Okeke", type: "Follow-up", date: "Mar 25, 2026", status: "Cancelled" },
                                ].map((appt, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-xs shrink-0">
                                                {appt.patient.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">{appt.patient}</p>
                                                <p className="text-xs font-poppins text-neutral-500">{appt.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <p className="text-xs font-poppins text-neutral-400 hidden sm:block">{appt.date}</p>
                                            <span className={`text-[11px] font-bold font-poppins px-2.5 py-1 rounded-full ${
                                                appt.status === "Completed" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                            }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs font-poppins text-neutral-400">Showing recent 4 of {doctor.appointments} total appointments</p>
                            </div>
                        </div>
                    )}

                    {/* ── ACCOUNT ACTIONS ── */}
                    {activeSection === "actions" && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-1">Account Actions</h3>
                                <p className="text-sm font-poppins text-neutral-500 mb-5">Administrative controls for this doctor's account.</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setDoctorStatus("Active")}
                                        disabled={currentStatus === "Active"}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold font-poppins text-green-900">Activate Account</p>
                                                <p className="text-xs font-poppins text-green-600">Allow this doctor to receive appointments</p>
                                            </div>
                                        </div>
                                        {currentStatus === "Active" && <span className="text-xs font-bold font-poppins text-green-700 bg-green-100 px-2 py-1 rounded-full">Current</span>}
                                    </button>

                                    <button
                                        onClick={() => setDoctorStatus("Suspended")}
                                        disabled={currentStatus === "Suspended"}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiXCircle className="w-5 h-5 text-red-600" />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold font-poppins text-red-900">Suspend Account</p>
                                                <p className="text-xs font-poppins text-red-600">Temporarily block this doctor from the platform</p>
                                            </div>
                                        </div>
                                        {currentStatus === "Suspended" && <span className="text-xs font-bold font-poppins text-red-700 bg-red-100 px-2 py-1 rounded-full">Current</span>}
                                    </button>

                                    <button className="w-full flex items-center space-x-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                        <FiMessageSquare className="w-5 h-5 text-primary-500" />
                                        <div className="text-left">
                                            <p className="text-sm font-semibold font-poppins text-neutral-900">Send Message</p>
                                            <p className="text-xs font-poppins text-neutral-500">Reach out to this doctor directly</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                                <h3 className="text-base font-archivo font-bold text-red-700 mb-1 flex items-center">
                                    <FiAlertTriangle className="mr-2" /> Danger Zone
                                </h3>
                                <p className="text-xs font-poppins text-neutral-500 mb-4">These actions are irreversible. Proceed with caution.</p>
                                <button className="flex items-center space-x-2 px-4 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-semibold font-poppins hover:bg-red-50 transition-colors">
                                    <FiXCircle className="w-4 h-4" />
                                    <span>Remove Doctor from Platform</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-neutral-500" />
            </div>
            <div>
                <p className="text-[11px] font-bold font-poppins text-neutral-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-poppins text-neutral-900 font-medium">{value}</p>
            </div>
        </div>
    );
}

export default AdminDoctorDetail;
