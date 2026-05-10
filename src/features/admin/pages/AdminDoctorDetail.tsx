import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FiArrowLeft, FiStar, FiMail, FiShield, FiAlertTriangle,
    FiCheckCircle, FiXCircle, FiClock, FiFileText, FiUser,
    FiBriefcase, FiMessageSquare, FiPauseCircle
} from "react-icons/fi";
import { useDoctorAvailability } from "@/features/doctor/hooks/useDoctors";
import { useAdminDoctor, useUpdateDoctorStatus } from "@/features/admin/hooks/useAdmin";
import type { DoctorStatus } from "@/types";

type SidebarSection = "overview" | "availability" | "credentials" | "actions";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_STYLES: Record<DoctorStatus, { badge: string; dot: string }> = {
    verified: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
    pending: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
    suspended: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

function to12h(time: string) {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
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

function AdminDoctorDetail() {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<SidebarSection>("overview");
    const [confirmSuspend, setConfirmSuspend] = useState(false);

    const { data: doctor, isLoading } = useAdminDoctor(doctorId ?? "");
    const { data: availability = [] } = useDoctorAvailability(doctorId ?? "");
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateDoctorStatus();

    const sidebarItems: { key: SidebarSection; label: string; icon: React.ElementType }[] = [
        { key: "overview", label: "Profile Overview", icon: FiUser },
        { key: "availability", label: "Availability", icon: FiClock },
        { key: "credentials", label: "Credentials", icon: FiShield },
        { key: "actions", label: "Account Actions", icon: FiFileText },
    ];

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 bg-neutral-100 rounded" />
                <div className="h-64 bg-neutral-100 rounded-2xl" />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FiAlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
                <h2 className="text-lg font-archivo font-bold text-neutral-900">Doctor Not Found</h2>
                <p className="text-sm font-poppins text-neutral-500 mt-1">This doctor may have been removed.</p>
                <button
                    onClick={() => navigate("/admin/doctors")}
                    className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg font-poppins text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                    Back to Registry
                </button>
            </div>
        );
    }

    const fullName = [doctor.firstName, doctor.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
    const initials = [doctor.firstName, doctor.lastName].filter(Boolean).map(n => n![0]).join("").toUpperCase() || "?";
    const statusStyle = STATUS_STYLES[doctor.status];

    const handleStatusUpdate = (status: DoctorStatus) => {
        updateStatus(
            { doctorId: doctor.id, status },
            { onSuccess: () => setConfirmSuspend(false) }
        );
    };

    return (
        <div className="animate-fade-in-up">
            {/* Back */}
            <button
                onClick={() => navigate("/admin/doctors")}
                className="flex items-center space-x-2 text-sm font-poppins font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-6"
            >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Doctor Registry</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* ── LEFT: Sidebar ── */}
                <aside className="w-full lg:w-64 shrink-0 space-y-4">

                    {/* Doctor Card */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 text-center">
                        <div className="relative inline-block mb-3">
                            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-xl uppercase">
                                {initials}
                            </div>
                            <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusStyle.dot}`} />
                        </div>
                        <h2 className="text-base font-archivo font-bold text-neutral-900">Dr. {fullName}</h2>
                        <p className="text-xs font-poppins text-neutral-500 mt-0.5">{doctor.specialty?.name ?? "No specialty"}</p>
                        <span className={`inline-block mt-2 text-[11px] font-bold font-poppins px-3 py-1 rounded-full capitalize ${statusStyle.badge}`}>
                            {doctor.status}
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
                                        {item.key === "actions" && doctor.status !== "verified" && (
                                            <span className="ml-auto w-2 h-2 rounded-full bg-amber-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-3">
                        <p className="text-[10px] font-bold font-poppins text-neutral-400 uppercase tracking-wider">Quick Info</p>
                        {doctor.rating != null && (
                            <div className="flex items-center justify-between text-sm font-poppins">
                                <span className="text-neutral-500 flex items-center"><FiStar className="w-4 h-4 mr-2 text-amber-400" />Rating</span>
                                <span className="font-bold text-neutral-900">{doctor.rating.toFixed(1)} / 5.0</span>
                            </div>
                        )}
                        {doctor.yearsOfPractice && (
                            <div className="flex items-center justify-between text-sm font-poppins">
                                <span className="text-neutral-500 flex items-center"><FiBriefcase className="w-4 h-4 mr-2 text-neutral-400" />Experience</span>
                                <span className="font-bold text-neutral-900">{doctor.yearsOfPractice} yrs</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500 flex items-center"><FiMail className="w-4 h-4 mr-2 text-neutral-400" />Email</span>
                            <span className="font-bold text-neutral-900 text-xs truncate max-w-32">{doctor.user?.email}</span>
                        </div>
                    </div>
                </aside>

                {/* ── RIGHT: Main Content ── */}
                <div className="flex-1 min-w-0 space-y-6">

                    {/* ── PROFILE OVERVIEW ── */}
                    {activeSection === "overview" && (
                        <>
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-5">Profile Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <InfoRow icon={FiMail} label="Email" value={doctor.user?.email ?? '—'} />
                                    {doctor.hospital && <InfoRow icon={FiBriefcase} label="Hospital / Clinic" value={doctor.hospital} />}
                                    {doctor.specialty?.name && <InfoRow icon={FiShield} label="Specialty" value={doctor.specialty.name} />}
                                    {doctor.yearsOfPractice && <InfoRow icon={FiClock} label="Experience" value={`${doctor.yearsOfPractice} years`} />}
                                    {doctor.licenseNo && <InfoRow icon={FiFileText} label="License No." value={doctor.licenseNo} />}
                                </div>
                            </div>

                            {doctor.bio && (
                                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                    <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-3">About</h3>
                                    <p className="text-sm font-poppins text-neutral-600 leading-relaxed">{doctor.bio}</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── AVAILABILITY ── */}
                    {activeSection === "availability" && (
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                            <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-5 flex items-center">
                                <FiClock className="mr-2 text-primary-500" />
                                Availability Schedule
                            </h3>
                            {availability.length === 0 ? (
                                <p className="text-sm font-poppins text-neutral-400 text-center py-8">
                                    This doctor has not set their availability yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {availability.map((slot, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-100 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <span className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 font-bold font-poppins text-xs flex items-center justify-center">
                                                    {DAY_NAMES[slot.dayOfWeek]}
                                                </span>
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">
                                                    {DAY_NAMES[slot.dayOfWeek]}
                                                </p>
                                            </div>
                                            <p className="text-sm font-poppins text-neutral-600 font-medium">
                                                {to12h(slot.startTime)} – {to12h(slot.endTime)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── CREDENTIALS ── */}
                    {activeSection === "credentials" && (
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                            <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-4">Credentials & Verification</h3>
                            <div className="space-y-4">
                                <div className={`flex items-center justify-between p-4 rounded-xl border ${
                                    doctor.status === "verified"
                                        ? "bg-green-50 border-green-100"
                                        : doctor.status === "suspended"
                                        ? "bg-red-50 border-red-100"
                                        : "bg-amber-50 border-amber-100"
                                }`}>
                                    <div className="flex items-center space-x-3">
                                        {doctor.status === "verified"
                                            ? <FiCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                            : doctor.status === "suspended"
                                            ? <FiXCircle className="w-5 h-5 text-red-500 shrink-0" />
                                            : <FiAlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                        }
                                        <div>
                                            <p className="text-sm font-semibold font-poppins text-neutral-900">Platform Verification</p>
                                            <p className="text-xs font-poppins text-neutral-500">
                                                {doctor.status === "verified"
                                                    ? "This doctor is verified and visible to patients."
                                                    : doctor.status === "suspended"
                                                    ? "This doctor is suspended and cannot receive appointments."
                                                    : "This doctor is pending review. Update in Account Actions."}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold font-poppins px-2.5 py-1 rounded-full capitalize ${statusStyle.badge}`}>
                                        {doctor.status}
                                    </span>
                                </div>

                                {doctor.licenseNo ? (
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <FiShield className="w-5 h-5 text-neutral-400 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">Medical License</p>
                                                <p className="text-xs font-poppins font-mono text-neutral-500">{doctor.licenseNo}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                                        <FiAlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                        <p className="text-sm font-poppins text-red-700">No license number provided.</p>
                                    </div>
                                )}

                                {doctor.specialty && (
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <FiFileText className="w-5 h-5 text-neutral-400 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold font-poppins text-neutral-900">Specialty</p>
                                                <p className="text-xs font-poppins text-neutral-500">{doctor.specialty.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── ACCOUNT ACTIONS ── */}
                    {activeSection === "actions" && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-1">Account Actions</h3>
                                <p className="text-sm font-poppins text-neutral-500 mb-5">
                                    Update this doctor's status on the platform. Verified doctors are visible to patients and can receive appointments.
                                </p>

                                {confirmSuspend && (
                                    <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-sm font-semibold font-poppins text-red-900 mb-3">
                                            Are you sure you want to suspend Dr. {fullName}? They will no longer be able to receive new appointments.
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleStatusUpdate("suspended")}
                                                disabled={isUpdating}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-poppins text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                                            >
                                                {isUpdating ? "Suspending…" : "Yes, Suspend"}
                                            </button>
                                            <button
                                                onClick={() => setConfirmSuspend(false)}
                                                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg font-poppins text-sm font-semibold hover:bg-neutral-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {/* Verify */}
                                    <button
                                        onClick={() => handleStatusUpdate("verified")}
                                        disabled={doctor.status === "verified" || isUpdating}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold font-poppins text-green-900">Verify Doctor</p>
                                                <p className="text-xs font-poppins text-green-600">
                                                    Allow this doctor to be listed and receive appointments
                                                </p>
                                            </div>
                                        </div>
                                        {doctor.status === "verified" && (
                                            <span className="text-xs font-bold font-poppins text-green-700 bg-green-100 px-2 py-1 rounded-full shrink-0">
                                                Current
                                            </span>
                                        )}
                                    </button>

                                    {/* Set Pending */}
                                    <button
                                        onClick={() => handleStatusUpdate("pending")}
                                        disabled={doctor.status === "pending" || isUpdating}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiPauseCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold font-poppins text-amber-900">Set as Pending</p>
                                                <p className="text-xs font-poppins text-amber-600">
                                                    Mark for review — doctor remains inactive until verified
                                                </p>
                                            </div>
                                        </div>
                                        {doctor.status === "pending" && (
                                            <span className="text-xs font-bold font-poppins text-amber-700 bg-amber-100 px-2 py-1 rounded-full shrink-0">
                                                Current
                                            </span>
                                        )}
                                    </button>

                                    {/* Suspend */}
                                    <button
                                        onClick={() => setConfirmSuspend(true)}
                                        disabled={doctor.status === "suspended" || isUpdating || confirmSuspend}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiXCircle className="w-5 h-5 text-red-600 shrink-0" />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold font-poppins text-red-900">Suspend Doctor</p>
                                                <p className="text-xs font-poppins text-red-600">
                                                    Remove from listings and block new appointments
                                                </p>
                                            </div>
                                        </div>
                                        {doctor.status === "suspended" && (
                                            <span className="text-xs font-bold font-poppins text-red-700 bg-red-100 px-2 py-1 rounded-full shrink-0">
                                                Current
                                            </span>
                                        )}
                                    </button>

                                    {/* Message */}
                                    <button className="w-full flex items-center space-x-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                        <FiMessageSquare className="w-5 h-5 text-primary-500 shrink-0" />
                                        <div className="text-left">
                                            <p className="text-sm font-semibold font-poppins text-neutral-900">Send Message</p>
                                            <p className="text-xs font-poppins text-neutral-500">Reach out to this doctor directly</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                                <h3 className="text-base font-archivo font-bold text-red-700 mb-1 flex items-center">
                                    <FiAlertTriangle className="mr-2" /> Danger Zone
                                </h3>
                                <p className="text-xs font-poppins text-neutral-500 mb-4">
                                    Permanent actions cannot be undone. Contact engineering for account deletion.
                                </p>
                                <button
                                    disabled
                                    title="Contact engineering to remove a doctor account"
                                    className="flex items-center space-x-2 px-4 py-2.5 border border-red-200 text-red-400 rounded-lg text-sm font-semibold font-poppins cursor-not-allowed opacity-50"
                                >
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

export default AdminDoctorDetail;
