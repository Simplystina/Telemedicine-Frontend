import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiMail, FiPhone, FiCalendar, FiUser,
    FiAlertTriangle, FiUserX, FiUserCheck, FiDroplet,
} from "react-icons/fi";
import { useAdminPatient, useDeactivateUser, useActivateUser } from "@/features/admin/hooks/useAdmin";

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

function AdminPatientDetail() {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const [confirmDeactivate, setConfirmDeactivate] = useState(false);

    const { data: patient, isLoading } = useAdminPatient(patientId ?? "");
    const { mutate: deactivate, isPending: isDeactivating } = useDeactivateUser();
    const { mutate: activate, isPending: isActivating } = useActivateUser();

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 bg-neutral-100 rounded" />
                <div className="h-64 bg-neutral-100 rounded-2xl" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FiAlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
                <h2 className="text-lg font-archivo font-bold text-neutral-900">Patient Not Found</h2>
                <p className="text-sm font-poppins text-neutral-500 mt-1">This patient may have been removed.</p>
                <button
                    onClick={() => navigate("/admin/patients")}
                    className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg font-poppins text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                    Back to Registry
                </button>
            </div>
        );
    }

    const name = [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Unknown Patient";
    const initials = [patient.firstName, patient.lastName].filter(Boolean).map(n => n![0]).join("").toUpperCase() || "?";
    const isActive = patient.user?.isActive !== false;

    return (
        <div className="animate-fade-in-up">
            <button
                onClick={() => navigate("/admin/patients")}
                className="flex items-center space-x-2 text-sm font-poppins font-semibold text-neutral-500 hover:text-primary-600 transition-colors mb-6"
            >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Patient Registry</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 space-y-4">
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 text-center">
                        <div className="relative inline-block mb-3">
                            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold font-archivo text-xl uppercase">
                                {initials}
                            </div>
                            <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white ${isActive ? "bg-green-500" : "bg-red-500"}`} />
                        </div>
                        <h2 className="text-base font-archivo font-bold text-neutral-900">{name}</h2>
                        <p className="text-xs font-poppins text-neutral-500 mt-0.5 truncate px-2">{patient.user?.email}</p>
                        <span className={`inline-block mt-2 text-[11px] font-bold font-poppins px-3 py-1 rounded-full ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-3">
                        <p className="text-[10px] font-bold font-poppins text-neutral-400 uppercase tracking-wider">Account</p>
                        <div className="flex items-center justify-between text-sm font-poppins">
                            <span className="text-neutral-500">Status</span>
                            <span className={`font-bold ${isActive ? "text-green-600" : "text-red-600"}`}>{isActive ? "Active" : "Deactivated"}</span>
                        </div>
                        {patient.user?.createdAt && (
                            <div className="flex items-center justify-between text-sm font-poppins">
                                <span className="text-neutral-500">Joined</span>
                                <span className="font-bold text-neutral-900 text-xs">
                                    {new Date(patient.user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main */}
                <div className="flex-1 min-w-0 space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h3 className="text-lg font-archivo font-bold text-neutral-900 mb-5">Profile Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <InfoRow icon={FiMail} label="Email" value={patient.user?.email ?? "—"} />
                            {patient.phone && <InfoRow icon={FiPhone} label="Phone" value={patient.phone} />}
                            {patient.dob && (
                                <InfoRow
                                    icon={FiCalendar}
                                    label="Date of Birth"
                                    value={new Date(patient.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                />
                            )}
                            {patient.gender && <InfoRow icon={FiUser} label="Gender" value={patient.gender} />}
                            {patient.bloodType && <InfoRow icon={FiDroplet} label="Blood Type" value={patient.bloodType} />}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h3 className="text-base font-archivo font-bold text-neutral-900 mb-1 flex items-center gap-2">
                            <FiAlertTriangle className="text-amber-500" /> Account Actions
                        </h3>
                        <p className="text-xs font-poppins text-neutral-500 mb-5">
                            Deactivating a patient prevents them from logging in or booking appointments.
                        </p>

                        {confirmDeactivate && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm font-semibold font-poppins text-red-900 mb-3">
                                    Are you sure you want to deactivate {name}'s account?
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => deactivate(patient.userId, { onSuccess: () => setConfirmDeactivate(false) })}
                                        disabled={isDeactivating}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-poppins text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                                    >
                                        {isDeactivating ? "Deactivating…" : "Yes, Deactivate"}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDeactivate(false)}
                                        className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg font-poppins text-sm font-semibold hover:bg-neutral-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {isActive ? (
                                <button
                                    onClick={() => setConfirmDeactivate(true)}
                                    disabled={confirmDeactivate}
                                    className="flex items-center space-x-3 p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full text-left"
                                >
                                    <FiUserX className="w-5 h-5 text-red-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold font-poppins text-red-900">Deactivate Account</p>
                                        <p className="text-xs font-poppins text-red-600">Block this patient's access to the platform</p>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => activate(patient.userId)}
                                    disabled={isActivating}
                                    className="flex items-center space-x-3 p-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full text-left"
                                >
                                    <FiUserCheck className="w-5 h-5 text-green-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold font-poppins text-green-900">
                                            {isActivating ? "Activating…" : "Reactivate Account"}
                                        </p>
                                        <p className="text-xs font-poppins text-green-600">Restore this patient's access to the platform</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPatientDetail;
