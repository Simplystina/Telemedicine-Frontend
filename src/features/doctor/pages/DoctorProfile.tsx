 import { useState } from "react";
import { FiUser, FiMapPin, FiMail, FiPhone, FiAward, FiEdit2, FiCheck } from "react-icons/fi";

function DoctorProfile() {
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        fullName: "Dr. Marcus Obi",
        specialty: "Cardiologist",
        subSpecialty: "Interventional Cardiology",
        email: "dr.marcus.obi@clinics.ng",
        phone: "+234 802 111 2233",
        location: "Lagos, Nigeria",
        bio: "Board-certified cardiologist with over 12 years of experience in interventional cardiology and heart failure management. Passionate about accessible, quality healthcare.",
        languages: "English, Igbo, Yoruba",
        consultationFee: "₦15,000",
        experience: "12 years",
        qualifications: [
            { degree: "MBBS", institution: "University of Lagos", year: "2008" },
            { degree: "FMCP (Cardiology)", institution: "National Postgraduate Medical College", year: "2015" },
        ],
    });

    const handleSave = () => {
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">My Profile</h1>
                    <p className="text-neutral-600 font-poppins text-sm">Manage your professional information and credentials.</p>
                </div>
                <button
                    onClick={editing ? handleSave : () => setEditing(true)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-poppins text-sm font-semibold transition-all ${saved
                        ? "bg-green-500 text-white"
                        : editing
                            ? "bg-primary-500 text-white hover:bg-primary-600"
                            : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        }`}
                >
                    {saved ? (
                        <><FiCheck className="w-4 h-4" /><span>Saved!</span></>
                    ) : editing ? (
                        <><FiCheck className="w-4 h-4" /><span>Save Changes</span></>
                    ) : (
                        <><FiEdit2 className="w-4 h-4" /><span>Edit Profile</span></>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Avatar & Identity Card */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-archivo text-3xl mb-4">
                        MO
                    </div>
                    <h2 className="text-lg font-archivo font-bold text-neutral-900">{form.fullName}</h2>
                    <p className="text-sm font-poppins text-primary-600 font-semibold">{form.specialty}</p>
                    <p className="text-xs font-poppins text-neutral-500 mt-1">{form.subSpecialty}</p>

                    <div className="mt-5 w-full space-y-3 text-left">
                        <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                            <FiMapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span>{form.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                            <FiMail className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span className="truncate">{form.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-poppins text-neutral-600">
                            <FiPhone className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span>{form.phone}</span>
                        </div>
                    </div>

                    <div className="mt-5 w-full pt-5 border-t border-neutral-100 grid grid-cols-2 gap-3 text-center">
                        <div>
                            <p className="text-lg font-archivo font-bold text-primary-600">{form.experience}</p>
                            <p className="text-[10px] font-poppins text-neutral-500">Experience</p>
                        </div>
                        <div>
                            <p className="text-lg font-archivo font-bold text-primary-600">{form.consultationFee}</p>
                            <p className="text-[10px] font-poppins text-neutral-500">Per Session</p>
                        </div>
                    </div>
                </div>

                {/* Editable Profile Details */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h2 className="text-base font-archivo font-bold text-neutral-900 flex items-center mb-4">
                            <FiUser className="mr-2 text-primary-500" /> Basic Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "Full Name", key: "fullName" },
                                { label: "Specialty", key: "specialty" },
                                { label: "Sub-specialty", key: "subSpecialty" },
                                { label: "Languages", key: "languages" },
                                { label: "Consultation Fee", key: "consultationFee" },
                                { label: "Years of Experience", key: "experience" },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1">{label}</label>
                                    {editing ? (
                                        <input
                                            value={form[key as keyof typeof form] as string}
                                            onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                            className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        />
                                    ) : (
                                        <p className="text-sm font-poppins text-neutral-800 font-medium">{form[key as keyof typeof form] as string}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-poppins font-semibold text-neutral-500 mb-1">Professional Bio</label>
                            {editing ? (
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                                />
                            ) : (
                                <p className="text-sm font-poppins text-neutral-600 leading-relaxed">{form.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h2 className="text-base font-archivo font-bold text-neutral-900 flex items-center mb-4">
                            <FiAward className="mr-2 text-primary-500" /> Qualifications
                        </h2>
                        <div className="space-y-3">
                            {form.qualifications.map((q, i) => (
                                <div key={i} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                        <FiAward className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold font-poppins text-neutral-900">{q.degree}</p>
                                        <p className="text-xs font-poppins text-neutral-500">{q.institution} · {q.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfile;
