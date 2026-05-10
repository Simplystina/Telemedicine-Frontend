import { FiMenu as FiMenuIcon, FiBell as FiBellIcon } from "react-icons/fi";

function DoctorTopNavigation({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
                >
                    <FiMenuIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 lg:flex-none flex items-center justify-end lg:justify-between w-full space-x-4 lg:space-x-0">

                {/* Search Bar placeholder */}
                <div className="hidden lg:flex max-w-md w-full ml-4">
                    {/* Placeholder for search if needed */}
                </div>

                {/* Right side icons */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative">
                        <FiBellIcon className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* Doctor Avatar */}
                    <div className="flex items-center space-x-3 border-l border-neutral-200 pl-4 ml-2">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-poppins font-semibold text-neutral-900">{}Dr. Marcus Obi</p>
                            <p className="text-xs font-poppins text-primary-500">Doctor</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-poppins">
                            MO
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DoctorTopNavigation;
