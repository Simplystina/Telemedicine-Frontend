import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    FiHome, FiUsers, FiActivity, FiShield, FiSettings,
    FiBell, FiMenu, FiLogOut
} from "react-icons/fi";
import Logo from "@assets/logo.png";

const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: FiHome, end: true },
    { name: "Doctor Moderation", path: "/admin/doctors", icon: FiShield },
    { name: "User Registry", path: "/admin/patients", icon: FiUsers },
    { name: "Platform Health", path: "/admin/health", icon: FiActivity },
    { name: "System Config", path: "/admin/settings", icon: FiSettings },
];

function AdminSidebar({ className = "hidden lg:flex sticky top-0", onClose }: { className?: string; onClose?: () => void }) {
    const navigate = useNavigate();

    return (
        <aside className={`w-64 h-screen bg-white border-r border-neutral-200 flex-col shrink-0 ${className}`}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-neutral-200 shrink-0">
                <div className="flex items-center space-x-2">
                    <img src={Logo} alt="logo" className="h-10 w-auto mix-blend-multiply" />
                    <span className="text-xs md:text-sm leading-tight font-semibold font-archivo text-primary-500">
                        Dr. Malik Telemedicine
                    </span>
                </div>
            </div>

            {/* Admin Badge */}
            <div className="mx-4 mt-4 mb-1 px-3 py-2 bg-primary-50 border border-primary-100 rounded-xl flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-archivo text-sm shrink-0">
                    OW
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold font-poppins text-primary-900 truncate">Platform Owner</p>
                    <p className="text-[10px] font-poppins text-primary-600">Admin Access</p>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4 px-4">
                <div className="space-y-1">
                    <p className="px-3 text-[10px] md:text-xs font-bold font-poppins text-neutral-400 uppercase tracking-wider mb-2">
                        Admin Panel
                    </p>
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
                <button
                    onClick={() => navigate("/admin-login")}
                    className="w-full flex items-center px-3 py-2.5 rounded-lg font-poppins text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <FiLogOut className="w-5 h-5 mr-3 shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

function AdminTopNavigation({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
                >
                    <FiMenu className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 lg:flex-none flex items-center justify-end lg:justify-between w-full space-x-4 lg:space-x-0">
                {/* Placeholder for search if needed */}
                <div className="hidden lg:flex max-w-md w-full ml-4" />

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative">
                        <FiBell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    {/* Owner Avatar */}
                    <div className="flex items-center space-x-3 border-l border-neutral-200 pl-4 ml-2">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-poppins font-semibold text-neutral-900">Platform Owner</p>
                            <p className="text-xs font-poppins text-primary-500">Administrator</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-poppins">
                            OW
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function AdminLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-neutral-50 w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <AdminSidebar className="flex" onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminTopNavigation onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
