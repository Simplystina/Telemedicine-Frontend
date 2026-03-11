import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@features/dashboard/components/Sidebar";
import TopNavigation from "@features/dashboard/components/TopNavigation";

function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-neutral-50 w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer (We can reuse Sidebar logic later or make it responsive, but for now we rely on the desktop component and can refine mobile later) - TO DO: Refine Mobile Sidebar */}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopNavigation onMenuClick={() => setIsMobileMenuOpen(true)} />

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

export default DashboardLayout;
