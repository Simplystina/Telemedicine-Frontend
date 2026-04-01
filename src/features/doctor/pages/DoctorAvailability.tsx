import { useState } from "react";
import { FiCheck, FiCalendar } from "react-icons/fi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// 30-minute slots from 08:00 AM to 06:30 PM
const TIME_SLOTS = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
];

// Initial state: Array of strings representing available start times for each day
const initialSchedule: Record<string, string[]> = {
    Monday: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM"],
    Tuesday: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM"],
    Wednesday: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "01:00 PM", "02:00 PM"],
    Thursday: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM"],
    Friday: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
    Saturday: [],
    Sunday: [],
};

function DoctorAvailability() {
    const [schedule, setSchedule] = useState(initialSchedule);
    const [saved, setSaved] = useState(false);

    const toggleSlot = (day: string, slot: string) => {
        setSchedule(prev => {
            const daySlots = prev[day];
            if (daySlots.includes(slot)) {
                return { ...prev, [day]: daySlots.filter(s => s !== slot) };
            } else {
                return { ...prev, [day]: [...daySlots, slot].sort() };
            }
        });
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const clearDay = (day: string) => {
        setSchedule(prev => ({ ...prev, [day]: [] }));
    };

    const fillDay = (day: string) => {
        setSchedule(prev => ({ ...prev, [day]: [...TIME_SLOTS] }));
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Availability Settings</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        Select the 30-minute blocks you are available for consultations.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className={`px-6 py-2.5 rounded-xl font-poppins font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${saved
                        ? "bg-green-500 text-white"
                        : "bg-primary-500 text-white hover:bg-primary-600 active:scale-95"
                        }`}
                >
                    {saved ? <><FiCheck className="w-4 h-4" /><span>Saved!</span></> : <span>Save Availability</span>}
                </button>
            </div>

            <div className="space-y-5">
                {DAYS.map((day) => (
                    <div key={day} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <FiCalendar className="w-5 h-5 text-primary-600" />
                                </div>
                                <h2 className="text-lg font-archivo font-bold text-neutral-900">{day}</h2>
                                {schedule[day].length > 0 ? (
                                    <span className="text-xs font-poppins font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        {schedule[day].length} blocks selected
                                    </span>
                                ) : (
                                    <span className="text-xs font-poppins font-semibold text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">
                                        Not available
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => fillDay(day)}
                                    className="text-[11px] font-poppins font-bold text-primary-600 hover:text-primary-700 px-2 py-1"
                                >
                                    Select All
                                </button>
                                <div className="w-px h-3 bg-neutral-200" />
                                <button
                                    onClick={() => clearDay(day)}
                                    className="text-[11px] font-poppins font-bold text-neutral-400 hover:text-red-500 px-2 py-1"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Slots Selection Grid */}
                        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2.5">
                            {TIME_SLOTS.map((slot) => {
                                const active = schedule[day].includes(slot);
                                return (
                                    <button
                                        key={slot}
                                        onClick={() => toggleSlot(day, slot)}
                                        className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl border-2 transition-all duration-200 relative group ${active
                                            ? "border-primary-500 bg-primary-50/50 shadow-sm ring-2 ring-primary-500/10"
                                            : "border-neutral-100 bg-neutral-50 hover:border-neutral-200"
                                            }`}
                                    >
                                        <span className={`text-[10px] font-poppins font-bold tracking-tight ${active ? "text-primary-700" : "text-neutral-600"}`}>
                                            {slot}
                                        </span>
                                        {active && (
                                            <div className="absolute -top-1 -right-1 bg-primary-500 rounded-full p-0.5 border-2 border-white">
                                                <FiCheck className="w-1.5 h-1.5 text-white" />
                                            </div>
                                        )}
                                        {/* Tooltip for end time */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] font-poppins px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            {slot} - {TIME_SLOTS[TIME_SLOTS.indexOf(slot) + 1] || "Next"}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DoctorAvailability;


