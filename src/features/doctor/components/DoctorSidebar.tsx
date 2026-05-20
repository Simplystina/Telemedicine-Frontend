import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    FiHome,
    FiCalendar,
    FiUsers,
    FiMessageSquare,
    FiClock,
    FiDollarSign,
    FiUser,
    FiBell,
    FiSettings,
    FiLogOut,
    FiClipboard,
    FiActivity
} from "react-icons/fi";
import Logo from "@assets/logo.png";

const navItems = [
    { name: "Dashboard", path: "/doctor", icon: FiHome, end: true },
    { name: "Appointments", path: "/doctor/appointments", icon: FiCalendar },
    { name: "My Patients", path: "/doctor/patients", icon: FiUsers },
    { name: "Clinical Records", path: "/doctor/records", icon: FiClipboard, badge: "3" },
    { name: "Lab Results", path: "/doctor/labs", icon: FiActivity },
    { name: "Messages", path: "/doctor/messages", icon: FiMessageSquare },
    { name: "Availability", path: "/doctor/availability", icon: FiClock },
    { name: "Earnings", path: "/doctor/earnings", icon: FiDollarSign },
    { name: "Notifications", path: "/doctor/notifications", icon: FiBell },
    { name: "My Profile", path: "/doctor/profile", icon: FiUser },
];

interface DoctorSidebarProps {
    className?: string;
    onClose?: () => void;
}

function DoctorSidebar({ className = "hidden lg:flex sticky top-0", onClose }: DoctorSidebarProps) {
    const { logout } = useAuth();

    return (
        <aside className={`w-64 h-full bg-white border-r border-neutral-200 flex-col shrink-0 ${className}`}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-neutral-200 shrink-0">
                <Link to="/" className="flex items-center space-x-2">
                    <div>
                        <img src={Logo} alt="logo" className="h-10 w-auto mix-blend-multiply" />
                    </div>
                    <span className="text-xs md:text-sm leading-2 font-semibold font-archivo text-primary-500">
                        Dr. Malik Telemedicine
                    </span>
                </Link>
            </div>

            {/* Doctor Badge */}
            <div className="mx-4 mt-4 mb-1 px-3 py-2 bg-primary-50 border border-primary-100 rounded-xl flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-archivo text-sm shrink-0">
                    DM
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold font-poppins text-primary-900 truncate">Dr. Marcus Obi</p>
                    <p className="text-[10px] font-poppins text-primary-600">Cardiologist</p>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4 px-4">
                <div className="space-y-1">
                    <p className="px-3 text-[10px] md:text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider mb-2">Main Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2.5 rounded-lg font-poppins text-xs md:text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary-50 text-primary-700 font-semibold"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5 mr-3 shrink-0" />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-neutral-200 space-y-1 shrink-0">
                <button className="w-full flex items-center px-3 py-2.5 rounded-lg font-poppins text-xs md:text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                    <FiSettings className="w-5 h-5 mr-3 shrink-0" />
                    Settings
                </button>
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center px-3 py-2.5 rounded-lg font-poppins text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <FiLogOut className="w-5 h-5 mr-3 shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default DoctorSidebar;
