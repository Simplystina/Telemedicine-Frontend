import { useState, useEffect } from "react";
import { FiUser, FiMail, FiEdit2, FiCheck, FiPhone, FiHeart } from "react-icons/fi";
import { usePatientProfile, useUpdatePatientProfile } from "@/features/patients/hooks/usePatient";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const GENDER_OPTIONS = ["male", "female", "other", "prefer-not-to-say"];
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function PatientProfile() {
    const { data: profile } = usePatientProfile();
    const { mutate: updateProfile, isPending: isSaving } = useUpdatePatientProfile();
    const userEmail = useAuthStore(state => state.user?.email ?? '');

    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        bloodType: "",
    });

    useEffect(() => {
        setForm({
            firstName: profile?.firstName ?? "",
            lastName: profile?.lastName ?? "",
            email: profile?.email ?? userEmail,
            phone: profile?.phone ?? "",
            dob: profile?.dob ?? "",
            gender: profile?.gender ?? "",
            bloodType: profile?.bloodType ?? "",
        });
    }, [profile, userEmail]);

    const handleSave = () => {
        updateProfile(
            {
                firstName: form.firstName || undefined,
                lastName: form.lastName || undefined,
                phone: form.phone || undefined,
                dob: form.dob || undefined,
                gender: form.gender || undefined,
                bloodType: form.bloodType || undefined,
            },
            {
                onSuccess: () => {
                    setEditing(false);
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                },
            }
        );
    };

    const textFields: { label: string; key: keyof typeof form; placeholder?: string; type?: string }[] = [
        { label: "First Name", key: "firstName", placeholder: "e.g. John" },
        { label: "Last Name", key: "lastName", placeholder: "e.g. Doe" },
        { label: "Phone Number", key: "phone", placeholder: "e.g. +234 800 000 0000" },
        { label: "Date of Birth", key: "dob", placeholder: "YYYY-MM-DD", type: "date" },
    ];

    const initials = ((form.firstName.charAt(0) || '') + (form.lastName.charAt(0) || '')).toUpperCase() || '?';
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ');

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">My Profile</h1>
                    <p className="text-neutral-600 font-poppins text-sm">Manage your personal information and health details.</p>
                </div>
                <div className="flex items-center gap-3">
                    {editing && (
                        <button
                            onClick={() => setEditing(false)}
                            className="px-5 py-2.5 rounded-xl font-poppins text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={editing ? handleSave : () => setEditing(true)}
                        disabled={isSaving}
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-poppins text-sm font-semibold transition-all disabled:opacity-60 ${saved
                            ? "bg-green-500 text-white"
                            : editing
                                ? "bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/20"
                                : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                            }`}
                    >
                        {saved ? (
                            <><FiCheck className="w-4 h-4" /><span>Saved!</span></>
                        ) : editing ? (
                            <><FiCheck className="w-4 h-4" /><span>{isSaving ? 'Saving…' : 'Save Changes'}</span></>
                        ) : (
                            <><FiEdit2 className="w-4 h-4" /><span>Edit Profile</span></>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Avatar & Identity Card */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col items-center text-center h-fit">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold font-archivo text-3xl mb-4 shadow-lg shadow-primary-500/20">
                        {initials}
                    </div>
                    <h2 className="text-lg font-archivo font-bold text-neutral-900">
                        {fullName || '—'}
                    </h2>
                    {form.bloodType && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-poppins font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                            <FiHeart className="w-3 h-3" /> {form.bloodType}
                        </span>
                    )}

                    <div className="mt-5 w-full space-y-3 text-left">
                        <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                            <FiMail className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span className="truncate">{form.email || '—'}</span>
                        </div>
                        {form.phone && (
                            <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                                <FiPhone className="w-4 h-4 text-neutral-400 shrink-0" />
                                <span>{form.phone}</span>
                            </div>
                        )}
                        {form.dob && (
                            <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                                <FiUser className="w-4 h-4 text-neutral-400 shrink-0" />
                                <span>Born {new Date(form.dob + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        )}
                        {form.gender && (
                            <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                                <span className="w-4 h-4 text-neutral-400 shrink-0 text-center text-xs">♂♀</span>
                                <span className="capitalize">{form.gender.replace(/-/g, ' ')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Editable Profile Details */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h2 className="text-base font-archivo font-bold text-neutral-900 flex items-center mb-5">
                            <FiUser className="mr-2 text-primary-500" /> Personal Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {textFields.map(({ label, key, placeholder, type }) => (
                                <div key={key}>
                                    <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                                        {label}
                                    </label>
                                    {editing ? (
                                        <input
                                            type={type ?? "text"}
                                            value={form[key] as string}
                                            placeholder={placeholder}
                                            onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        />
                                    ) : (
                                        <p className="text-sm font-poppins text-neutral-800 font-medium py-1">
                                            {key === 'dob' && form.dob
                                                ? new Date(form.dob + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : (form[key] as string) || <span className="text-neutral-400">—</span>}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Gender */}
                            <div>
                                <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                                    Gender
                                </label>
                                {editing ? (
                                    <select
                                        value={form.gender}
                                        onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                                    >
                                        <option value="">Select gender</option>
                                        {GENDER_OPTIONS.map(g => (
                                            <option key={g} value={g}>{g.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm font-poppins text-neutral-800 font-medium py-1 capitalize">
                                        {form.gender ? form.gender.replace(/-/g, ' ') : <span className="text-neutral-400">—</span>}
                                    </p>
                                )}
                            </div>

                            {/* Blood Type */}
                            <div>
                                <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                                    Blood Type
                                </label>
                                {editing ? (
                                    <select
                                        value={form.bloodType}
                                        onChange={(e) => setForm(prev => ({ ...prev, bloodType: e.target.value }))}
                                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                                    >
                                        <option value="">Select blood type</option>
                                        {BLOOD_TYPES.map(bt => (
                                            <option key={bt} value={bt}>{bt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm font-poppins text-neutral-800 font-medium py-1">
                                        {form.bloodType || <span className="text-neutral-400">—</span>}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div className="mt-4">
                            <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                                Email Address
                            </label>
                            <p className="text-sm font-poppins text-neutral-500 py-1 flex items-center gap-2">
                                {form.email || '—'}
                                <span className="text-[10px] bg-neutral-100 text-neutral-400 px-2 py-0.5 rounded font-semibold">Read-only</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientProfile;
