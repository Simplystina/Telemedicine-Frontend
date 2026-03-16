import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    FiHome,
    FiSearch,
    FiCalendar,
    FiFileText,
    FiMessageSquare,
    FiStar,
    FiSettings,
    FiLogOut
} from "react-icons/fi";
import Logo from "@assets/logo.png";

const navItems = [
    { name: "Dashboard", path: "/patient", icon: FiHome, end: true },
    { name: "Browse Doctors", path: "/patient/browse-doctors", icon: FiSearch },
    { name: "My Appointments", path: "/patient/appointments", icon: FiCalendar },
    { name: "Health Records", path: "/patient/records", icon: FiFileText },
    { name: "Messages", path: "/patient/messages", icon: FiMessageSquare },
    { name: "Subscription", path: "/patient/subscription", icon: FiStar },
];

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add any actual logout logic here (clearing tokens, etc)
        navigate("/auth/login");
    };

    return (
        <aside className="w-64 h-screen bg-white border-r border-neutral-200 hidden lg:flex flex-col sticky top-0 shrink-0">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-neutral-200 shrink-0">

                <Link to="/" className="flex items-center space-x-2">
                    <div>
                        <img src={Logo} alt="logo" className="h-10 w-auto mix-blend-multiply" />
                    </div>
                    <span className="text-sm leading-2 font-semibold font-archivo text-primary-500">
                        Dr. Malik Telemedicine
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-1">
                    <p className="px-3 text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider mb-2">Main Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2.5 rounded-lg font-poppins text-sm font-medium transition-colors ${isActive
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
                <button className="w-full flex items-center px-3 py-2.5 rounded-lg font-poppins text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                    <FiSettings className="w-5 h-5 mr-3 shrink-0" />
                    Settings
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2.5 rounded-lg font-poppins text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <FiLogOut className="w-5 h-5 mr-3 shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
