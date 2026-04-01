import { useState } from "react";
import { FiBell, FiCalendar, FiMessageSquare, FiDollarSign, FiCheck, FiX } from "react-icons/fi";

type NotifType = "appointment" | "message" | "payment" | "system";

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    body: string;
    time: string;
    read: boolean;
}

const typeConfig: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
    appointment: { icon: FiCalendar, color: "text-primary-600", bg: "bg-primary-50" },
    message: { icon: FiMessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    payment: { icon: FiDollarSign, color: "text-green-600", bg: "bg-green-50" },
    system: { icon: FiBell, color: "text-amber-600", bg: "bg-amber-50" },
};

const INITIAL_NOTIFS: Notification[] = [
    { id: "n1", type: "appointment", title: "New Appointment Booked", body: "Jane Doe scheduled a follow-up for Mar 31 at 09:00 AM.", time: "2 minutes ago", read: false },
    { id: "n2", type: "message", title: "New Message from Emeka Eze", body: "\"Good morning Doctor, my BP was slightly elevated today...\"", time: "20 minutes ago", read: false },
    { id: "n3", type: "payment", title: "Payment Received", body: "₦15,000 consultation fee from Jane Doe has been processed.", time: "1 hour ago", read: false },
    { id: "n4", type: "appointment", title: "Appointment Cancelled", body: "Fatima Musa cancelled her appointment for Mar 27 at 10:00 AM.", time: "3 hours ago", read: true },
    { id: "n5", type: "system", title: "Profile Verification Complete", body: "Your credentials have been verified. You are now fully visible to patients.", time: "Yesterday", read: true },
    { id: "n6", type: "payment", title: "Payout Initiated", body: "₦350,000 payout to your bank account has been initiated.", time: "2 days ago", read: true },
    { id: "n7", type: "message", title: "New Message from Aisha Bello", body: "\"When should I take my next dose?\"", time: "3 days ago", read: true },
];

function DoctorNotifications() {
    const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
    const unreadCount = notifs.filter(n => !n.read).length;

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
    const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Notifications</h1>
                    <p className="text-neutral-600 font-poppins text-sm">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up!"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-neutral-200 font-poppins text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        <FiCheck className="w-4 h-4" />
                        <span>Mark all read</span>
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {notifs.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiBell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <p className="font-poppins text-neutral-500">No notifications.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {notifs.map((notif) => {
                            const cfg = typeConfig[notif.type];
                            const Icon = cfg.icon;
                            return (
                                <div
                                    key={notif.id}
                                    className={`flex items-start space-x-4 p-5 transition-colors group ${!notif.read ? "bg-primary-50/30" : "hover:bg-neutral-50"}`}
                                >
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-poppins leading-snug ${!notif.read ? "font-bold text-neutral-900" : "font-semibold text-neutral-700"}`}>
                                                {notif.title}
                                            </p>
                                            <div className="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notif.read && (
                                                    <button onClick={() => markRead(notif.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Mark as read">
                                                        <FiCheck className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <button onClick={() => dismiss(notif.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Dismiss">
                                                    <FiX className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs font-poppins text-neutral-500 mt-0.5 leading-relaxed">{notif.body}</p>
                                        <p className="text-[11px] font-poppins text-neutral-400 mt-1.5">{notif.time}</p>
                                    </div>

                                    {/* Unread dot */}
                                    {!notif.read && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0 mt-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorNotifications;
