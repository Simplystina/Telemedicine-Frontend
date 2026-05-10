import { useState, useEffect } from "react";
import { FiCheck, FiCalendar } from "react-icons/fi";
import { useMyAvailability, useUpdateAvailability } from "@/features/doctor/hooks/useDoctors";
import type { AvailabilitySlot } from "@/types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// 30-minute slots from 08:00 AM to 06:30 PM
const TIME_SLOTS = [
    "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 AM",
    "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM",
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
    "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
];

const DAY_TO_DOW: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6,
};
const DOW_TO_DAY: Record<number, string> = {
    0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
    4: "Thursday", 5: "Friday", 6: "Saturday",
};

function to24h(time12: string): string {
    const [time, period] = time12.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "AM") {
        if (hours === 12) hours = 0;
    } else {
        if (hours !== 12) hours += 12;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function to12h(time24: string): string {
    let [hours, minutes] = time24.split(":").map(Number);
    const period = hours < 12 ? "AM" : "PM";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

function add30min(time24: string): string {
    let [hours, minutes] = time24.split(":").map(Number);
    minutes += 30;
    if (minutes >= 60) { minutes -= 60; hours += 1; }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function isConsecutive(slot1: string, slot2: string): boolean {
    return add30min(to24h(slot1)) === to24h(slot2);
}

function generateSlotsFromRange(startTime24: string, endTime24: string): string[] {
    const slots: string[] = [];
    let current = startTime24;
    while (current < endTime24) {
        slots.push(to12h(current));
        current = add30min(current);
    }
    return slots;
}

function apiSlotsToSchedule(apiSlots: AvailabilitySlot[]): Record<string, string[]> {
    const schedule: Record<string, string[]> = Object.fromEntries(DAYS.map(d => [d, []]));
    apiSlots.forEach(slot => {
        const day = DOW_TO_DAY[slot.dayOfWeek];
        if (!day) return;
        schedule[day] = [...schedule[day], ...generateSlotsFromRange(slot.startTime, slot.endTime)];
    });
    DAYS.forEach(day => schedule[day].sort());
    return schedule;
}

function scheduleToApiSlots(schedule: Record<string, string[]>): AvailabilitySlot[] {
    const result: AvailabilitySlot[] = [];
    DAYS.forEach(day => {
        const daySlots = [...schedule[day]].sort();
        if (daySlots.length === 0) return;
        const dayOfWeek = DAY_TO_DOW[day];
        let i = 0;
        while (i < daySlots.length) {
            const startTime = to24h(daySlots[i]);
            let j = i;
            while (j + 1 < daySlots.length && isConsecutive(daySlots[j], daySlots[j + 1])) {
                j++;
            }
            const endTime = add30min(to24h(daySlots[j]));
            result.push({ dayOfWeek, startTime, endTime });
            i = j + 1;
        }
    });
    return result;
}

const emptySchedule = () => Object.fromEntries(DAYS.map(d => [d, [] as string[]]));

function DoctorAvailability() {
    const { data: apiSlots } = useMyAvailability();
    const { mutate: updateAvailability, isPending } = useUpdateAvailability();

    const [schedule, setSchedule] = useState<Record<string, string[]>>(emptySchedule);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (apiSlots) {
            setSchedule(apiSlotsToSchedule(apiSlots));
        }
    }, [apiSlots]);

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
        updateAvailability(
            { slots: scheduleToApiSlots(schedule) },
            {
                onSuccess: () => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                },
            }
        );
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
                    disabled={isPending}
                    className={`px-6 py-2.5 rounded-xl font-poppins font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-60 ${saved
                        ? "bg-green-500 text-white"
                        : "bg-primary-500 text-white hover:bg-primary-600 active:scale-95"
                        }`}
                >
                    {saved ? <><FiCheck className="w-4 h-4" /><span>Saved!</span></> : <span>{isPending ? 'Saving…' : 'Save Availability'}</span>}
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
