import { useState, useEffect } from "react";
import { FiUser, FiMail, FiEdit2, FiCheck, FiShield, FiBriefcase } from "react-icons/fi";
import { useMyDoctorProfile, useUpdateDoctorProfile, useSpecialties } from "@/features/doctor/hooks/useDoctors";
import SpecialtySelect from "@/features/auth/components/SpecialtyMultiSelect";

function DoctorProfile() {
    const { data: doctorData } = useMyDoctorProfile();
    const { mutate: updateProfile, isPending: isSaving } = useUpdateDoctorProfile();
    const { data: specialties = [] } = useSpecialties();

    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        specialtyId: undefined as number | undefined,
        hospital: "",
        licenseNo: "",
        email: "",
        bio: "",
        yearsOfPractice: "",
    });

    useEffect(() => {
        if (doctorData) {
            setForm(prev => ({
                ...prev,
                firstName: doctorData.firstName ?? '',
                lastName: doctorData.lastName ?? '',
                phone: doctorData.phone ?? '',
                email: doctorData.email,
                bio: doctorData.bio ?? '',
                yearsOfPractice: doctorData.yearsOfPractice?.toString() ?? '',
                hospital: doctorData.hospital ?? '',
                licenseNo: doctorData.licenseNo ?? '',
                specialtyId: doctorData.specialtyId ?? doctorData.specialty?.id,
            }));
        }
    }, [doctorData]);

    const specialtyName = specialties.find(s => s.id === form.specialtyId)?.name
        ?? doctorData?.specialty?.name ?? '';

    const handleSave = () => {
        updateProfile(
            {
                firstName: form.firstName || undefined,
                lastName: form.lastName || undefined,
                phone: form.phone || undefined,
                hospital: form.hospital || undefined,
                licenseNo: form.licenseNo || undefined,
                bio: form.bio || undefined,
                yearsOfPractice: form.yearsOfPractice || undefined,
                specialtyId: form.specialtyId,
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

    const textFields: { label: string; key: keyof typeof form; placeholder?: string }[] = [
        { label: "First Name", key: "firstName", placeholder: "e.g. John" },
        { label: "Last Name", key: "lastName", placeholder: "e.g. Doe" },
        { label: "Phone Number", key: "phone", placeholder: "e.g. +234 801 234 5678" },
        { label: "Hospital / Clinic", key: "hospital", placeholder: "e.g. Lagos General Hospital" },
        { label: "License Number", key: "licenseNo", placeholder: "e.g. MED-12345" },
        { label: "Years of Experience", key: "yearsOfPractice", placeholder: "e.g. 10" },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">My Profile</h1>
                    <p className="text-neutral-600 font-poppins text-sm">Manage your professional information and credentials.</p>
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
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold font-archivo text-3xl mb-4 uppercase shadow-lg shadow-primary-500/20">
                        {(form.firstName.charAt(0) || '?')}{form.lastName.charAt(0)}
                    </div>
                    <h2 className="text-lg font-archivo font-bold text-neutral-900">
                        {form.firstName || form.lastName ? `Dr. ${form.firstName} ${form.lastName}`.trim() : '—'}
                    </h2>
                    {specialtyName && (
                        <p className="text-sm font-poppins text-primary-600 font-semibold mt-1">{specialtyName}</p>
                    )}
                    {form.hospital && (
                        <p className="text-xs font-poppins text-neutral-500 mt-0.5">{form.hospital}</p>
                    )}

                    <div className="mt-5 w-full space-y-3 text-left">
                        <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                            <FiMail className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span className="truncate">{form.email || '—'}</span>
                        </div>
                        {form.licenseNo && (
                            <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                                <FiShield className="w-4 h-4 text-neutral-400 shrink-0" />
                                <span>{form.licenseNo}</span>
                            </div>
                        )}
                        {form.yearsOfPractice && (
                            <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                                <FiBriefcase className="w-4 h-4 text-neutral-400 shrink-0" />
                                <span>{form.yearsOfPractice} yrs experience</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Editable Profile Details */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h2 className="text-base font-archivo font-bold text-neutral-900 flex items-center mb-5">
                            <FiUser className="mr-2 text-primary-500" /> Basic Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {textFields.map(({ label, key, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                                        {label}
                                    </label>
                                    {editing ? (
                                        <input
                                            value={form[key] as string}
                                            placeholder={placeholder}
                                            onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        />
                                    ) : (
                                        <p className="text-sm font-poppins text-neutral-800 font-medium py-1">
                                            {(form[key] as string) || <span className="text-neutral-400">—</span>}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Specialty field */}
                            <div>
                                <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                                    Specialty
                                </label>
                                {editing ? (
                                    <SpecialtySelect
                                        value={form.specialtyId}
                                        onChange={(id) => setForm(prev => ({ ...prev, specialtyId: id }))}
                                        label=""
                                    />
                                ) : (
                                    <p className="text-sm font-poppins text-neutral-800 font-medium py-1">
                                        {specialtyName || <span className="text-neutral-400">—</span>}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mt-5">
                            <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                                Professional Bio
                            </label>
                            {editing ? (
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={4}
                                    placeholder="Describe your background, approach, and areas of expertise..."
                                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                                />
                            ) : (
                                <p className="text-sm font-poppins text-neutral-600 leading-relaxed">
                                    {form.bio || <span className="text-neutral-400">—</span>}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfile;
