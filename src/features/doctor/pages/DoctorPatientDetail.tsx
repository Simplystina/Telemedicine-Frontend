import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiCalendar, FiMessageSquare, FiVideo,
    FiFileText, FiActivity, FiHeart, FiDroplet, FiAlertCircle, FiCheckCircle,
    FiUploadCloud, FiEye, FiDownload, FiClock
} from "react-icons/fi";
import ScheduleAppointmentModal from "../components/ScheduleAppointmentModal";
import ConsultationNoteModal from "../components/ConsultationNoteModal";

const PATIENT = {
    id: "p1",
    name: "Jane Doe",
    age: 34,
    gender: "Female",
    dob: "March 12, 1992",
    phone: "+234 801 234 5678",
    email: "jane.doe@email.com",
    bloodType: "O+",
    condition: "Hypertension",
    allergies: ["Penicillin", "Aspirin"],
    status: "active",
};

const VISIT_HISTORY = [
    { id: 'v1', date: "Mar 29, 2026", type: "Follow-up", notes: "BP improved to 130/85. Continue current medication.", rx: "Lisinopril 10mg", hasNotes: true },
    { id: 'v2', date: "Mar 15, 2026", type: "Routine Check", notes: "BP slightly elevated at 145/90. Adjusted dosage.", rx: "Lisinopril 20mg", hasNotes: true },
    { id: 'v3', date: "Today, 10:30 AM", type: "Full Consultation", notes: "", rx: "", hasNotes: false },
];

const vitals = [
    { label: "Blood Pressure", value: "130/85 mmHg", icon: FiHeart, color: "text-red-500", bg: "bg-red-50", status: "normal" },
    { label: "Heart Rate", value: "72 bpm", icon: FiActivity, color: "text-pink-500", bg: "bg-pink-50", status: "normal" },
    { label: "Blood Glucose", value: "98 mg/dL", icon: FiDroplet, color: "text-blue-500", bg: "bg-blue-50", status: "normal" },
];

const TEST_RESULTS = [
    {
        id: "tr1",
        name: "Full Blood Count (FBC)",
        requestedBy: "Dr. Marcus Obi",
        requestedDate: "Mar 28, 2026",
        uploadedDate: "Mar 30, 2026",
        status: "new",
        fileType: "PDF",
        fileSize: "1.2 MB",
        notes: "Requested to monitor white cell count due to recurring fatigue.",
    },
    {
        id: "tr2",
        name: "Electrocardiogram (ECG)",
        requestedBy: "Dr. Marcus Obi",
        requestedDate: "Mar 15, 2026",
        uploadedDate: "Mar 17, 2026",
        status: "reviewed",
        fileType: "PDF",
        fileSize: "3.4 MB",
        notes: "Routine cardiac check — results within normal range.",
    },
    {
        id: "tr3",
        name: "Lipid Profile Panel",
        requestedBy: "Dr. Marcus Obi",
        requestedDate: "Feb 20, 2026",
        uploadedDate: "Feb 22, 2026",
        status: "reviewed",
        fileType: "PDF",
        fileSize: "0.9 MB",
        notes: "LDL slightly elevated. Dietary advice provided.",
    },
    {
        id: "tr4",
        name: "Urinalysis",
        requestedBy: "Dr. Marcus Obi",
        requestedDate: "Apr 01, 2026",
        uploadedDate: null,
        status: "pending",
        fileType: null,
        fileSize: null,
        notes: "Awaiting patient upload.",
    },
];

function DoctorPatientDetail() {
    const navigate = useNavigate();
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [mainTab, setMainTab] = useState<"timeline" | "results">("timeline");
    const newResultsCount = TEST_RESULTS.filter(r => r.status === "new").length;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link to="/doctor/patients" className="inline-flex items-center text-sm font-poppins font-semibold text-neutral-500 hover:text-primary-600 transition-colors group">
                    <div className="p-2 bg-white rounded-lg border border-neutral-200 mr-3 group-hover:border-primary-100 transition-all">
                        <FiArrowLeft className="w-4 h-4" />
                    </div>
                    Back to My Patients
                </Link>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => navigate(`/doctor/call/a1`)}
                        className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold font-poppins text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center space-x-2"
                    >
                        <FiVideo className="w-4 h-4" />
                        <span>Start Video Call</span>
                    </button>
                    <button className="p-3 bg-white border border-neutral-200 text-neutral-500 rounded-2xl hover:bg-neutral-50 transition-all shadow-sm">
                        <FiMessageSquare className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Patient Hero Card */}
            <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm p-8 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold font-archivo text-3xl shadow-inner animate-scale-in">
                        {PATIENT.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-archivo font-bold text-neutral-900 leading-none">{PATIENT.name}</h1>
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold font-poppins uppercase tracking-wider border border-green-100">Active Patient</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-500 font-poppins text-sm">
                            <span className="flex items-center"><FiCalendar className="mr-2 text-neutral-400" /> {PATIENT.age} years · {PATIENT.gender}</span>
                            <span className="flex items-center italic">DOB: {PATIENT.dob}</span>
                            <span className="text-primary-600 font-semibold">{PATIENT.bloodType} Blood Type</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsApptModalOpen(true)}
                            className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold font-poppins text-sm hover:bg-black transition-all"
                        >
                            Schedule Appointment
                        </button>
                    </div>
                </div>

                {/* Patient Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10 pt-8 border-t border-neutral-100">
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-1">Condition</p>
                        <p className="text-sm font-bold font-archivo text-primary-600">{PATIENT.condition}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-1">Allergies</p>
                        <p className="text-sm font-bold font-archivo text-neutral-900">{PATIENT.allergies.join(", ")}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-1">Contact</p>
                        <p className="text-sm font-archivo text-neutral-900">{PATIENT.phone}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins mb-1">Last Seen</p>
                        <p className="text-sm font-archivo text-neutral-900">Today, 10:30 AM</p>
                    </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Medical Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                            <div className="flex items-center space-x-1 bg-neutral-100 rounded-xl p-1">
                                <button
                                    onClick={() => setMainTab("timeline")}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-poppins text-sm font-semibold transition-colors ${
                                        mainTab === "timeline" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                                    }`}
                                >
                                    <FiCalendar className="w-4 h-4" />
                                    <span>Medical Timeline</span>
                                </button>
                                <button
                                    onClick={() => setMainTab("results")}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-poppins text-sm font-semibold transition-colors relative ${
                                        mainTab === "results" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                                    }`}
                                >
                                    <FiUploadCloud className="w-4 h-4" />
                                    <span>Lab Results</span>
                                    {newResultsCount > 0 && (
                                        <span className="inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full ml-0.5">
                                            {newResultsCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <span className="text-xs font-poppins font-bold text-neutral-400 uppercase tracking-widest">
                                {mainTab === "timeline" ? `${VISIT_HISTORY.length} RECENT VISITS` : `${TEST_RESULTS.length} TESTS`}
                            </span>
                        </div>
                        
                        {/* Medical Timeline */}
                        {mainTab === "timeline" && (
                        <div className="p-8 space-y-10 relative">
                            {/* Vertical Timeline Thread */}
                            <div className="absolute left-11 top-10 bottom-10 w-0.5 bg-neutral-100" />

                            {VISIT_HISTORY.map((visit, index) => (
                                <div key={index} className="relative pl-16 group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    {/* Timeline Node */}
                                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full border-4 border-white z-10 transition-transform group-hover:scale-125 ${
                                        visit.hasNotes ? "bg-primary-500 shadow-[0_0_10px_rgba(99,106,232,0.4)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                    }`} />
                                    
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <p className={`text-sm font-bold font-poppins ${visit.hasNotes ? "text-primary-600" : "text-amber-600 animate-pulse"}`}>
                                                    {visit.date}
                                                </p>
                                                <h3 className="text-lg font-archivo font-bold text-neutral-900 mt-0.5">{visit.type}</h3>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold font-poppins uppercase tracking-wider border ${
                                                    visit.hasNotes ? "bg-neutral-50 text-neutral-500 border-neutral-200" : "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}>
                                                    {visit.hasNotes ? "Recorded by Dr. Marcus Obi" : "Documentation Pending"}
                                                </span>
                                            </div>
                                        </div>

                                        {visit.hasNotes ? (
                                            <div className="grid md:grid-cols-2 gap-6 bg-neutral-50/50 rounded-3xl p-6 border border-neutral-100 group-hover:border-primary-100 group-hover:bg-primary-50/20 transition-all">
                                                <div className="space-y-3">
                                                    <h4 className="flex items-center text-xs font-bold text-neutral-400 uppercase tracking-widest font-poppins">
                                                        <FiFileText className="mr-2 text-primary-400" /> Clinical Notes
                                                    </h4>
                                                    <p className="text-sm text-neutral-700 font-poppins leading-relaxed italic line-clamp-3">
                                                        "{visit.notes}"
                                                    </p>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="flex items-center text-xs font-bold text-neutral-400 uppercase tracking-widest font-poppins">
                                                        <FiActivity className="mr-2 text-primary-400" /> Treatment Detail
                                                    </h4>
                                                    <div className="inline-flex items-center px-4 py-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
                                                        <FiCheckCircle className="w-3.5 h-3.5 text-green-500 mr-2" />
                                                        <span className="text-sm font-bold font-poppins text-neutral-800">{visit.rx}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-50/30 rounded-3xl p-6 border border-amber-100 group-hover:border-amber-200 transition-all">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                                                        <FiAlertCircle className="w-5 h-5 animate-bounce" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold font-poppins text-amber-900">Missing Consultation Record</p>
                                                        <p className="text-xs font-poppins text-amber-700">Please provide notes for this session to update the medical record.</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setIsNoteModalOpen(true)}
                                                    className="px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold font-poppins text-sm shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all shrink-0"
                                                >
                                                    Fill Note Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}

                        {/* Lab Results Tab */}
                        {mainTab === "results" && (
                        <div className="p-8 space-y-4">
                            {TEST_RESULTS.map((result) => (
                                <div key={result.id} className={`rounded-2xl border p-5 transition-all ${
                                    result.status === "new"
                                        ? "border-blue-200 bg-blue-50/40"
                                        : result.status === "pending"
                                        ? "border-amber-200 bg-amber-50/30"
                                        : "border-neutral-100 bg-neutral-50/50"
                                }`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start space-x-4">
                                            {/* File icon */}
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold font-poppins text-xs ${
                                                result.status === "pending"
                                                    ? "bg-neutral-200 text-neutral-400"
                                                    : "bg-white border border-neutral-200 text-primary-600 shadow-sm"
                                            }`}>
                                                {result.fileType ?? "—"}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                                    <p className="text-sm font-bold font-poppins text-neutral-900">{result.name}</p>
                                                    {result.status === "new" && (
                                                        <span className="text-[10px] font-bold font-poppins text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">NEW</span>
                                                    )}
                                                    {result.status === "pending" && (
                                                        <span className="text-[10px] font-bold font-poppins text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">AWAITING UPLOAD</span>
                                                    )}
                                                    {result.status === "reviewed" && (
                                                        <span className="text-[10px] font-bold font-poppins text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center"><FiCheckCircle className="mr-1" />Reviewed</span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-poppins text-neutral-500 mt-1">
                                                    Requested {result.requestedDate}
                                                    {result.uploadedDate && ` · Uploaded ${result.uploadedDate}`}
                                                    {result.fileSize && ` · ${result.fileSize}`}
                                                </p>
                                                <p className="text-xs font-poppins text-neutral-400 mt-1.5 italic">{result.notes}</p>
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        {result.status !== "pending" && (
                                            <div className="flex items-center space-x-2 shrink-0">
                                                <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold font-poppins text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors shadow-sm">
                                                    <FiEye className="w-3.5 h-3.5" />
                                                    <span>View</span>
                                                </button>
                                                <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold font-poppins text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors shadow-sm">
                                                    <FiDownload className="w-3.5 h-3.5" />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        )}
                                        {result.status === "pending" && (
                                            <div className="flex items-center space-x-1.5 shrink-0 text-amber-500">
                                                <FiClock className="w-4 h-4" />
                                                <span className="text-xs font-poppins font-semibold">Pending</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}

                        <div className="p-6 bg-neutral-50/50 border-t border-neutral-100 text-center">
                            <button className="text-sm font-bold font-poppins text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest">
                                Load Full Visit History
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content: Vitals & Rx */}
                <div className="space-y-8">
                    {/* Recent Vitals */}
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm p-8">
                        <h2 className="text-xl font-archivo font-bold text-neutral-900 mb-8">Latest Vitals</h2>
                        <div className="space-y-6">
                            {vitals.map((v) => (
                                <div key={v.label} className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${v.bg}`}>
                                            <v.icon className={`w-6 h-6 ${v.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-poppins">{v.label}</p>
                                            <p className="text-base font-bold font-archivo text-neutral-900">{v.value}</p>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg border border-green-100">
                                        Normal
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 bg-neutral-50 rounded-2xl text-xs font-bold font-poppins text-neutral-500 hover:bg-neutral-100 transition-all">
                            View Vitals Trends
                        </button>
                    </div>

                    {/* Active Prescriptions */}
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm p-8  text-neutral-900 relative overflow-hidden">
                        <h2 className="text-xl font-archivo font-bold mb-6 flex items-center">
                            <FiDroplet className="mr-3 text-primary-400" /> Active Rx
                        </h2>
                        <div className="space-y-4 relative z-10">
                            {VISIT_HISTORY.filter(v => v.hasNotes).map((v, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                    <p className="text-sm font-bold font-poppins text-white">{v.rx.split(' ')[0]}</p>
                                    <p className="text-xs font-poppins text-neutral-400 mt-1">{v.rx.split(' ').slice(1).join(' ')} · Prescribed {v.date}</p>
                                </div>
                            ))}
                        </div>
                        {/* Static Mesh Gradient Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                    </div>
                </div>
            </div>

            <ScheduleAppointmentModal
                isOpen={isApptModalOpen}
                onClose={() => setIsApptModalOpen(false)}
                preSelectedPatientId={PATIENT.id}
            />

            <ConsultationNoteModal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                patientName={PATIENT.name}
            />
        </div>
    );
}

export default DoctorPatientDetail;
