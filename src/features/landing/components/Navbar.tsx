import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import SignUpButton from "@/shared/components/SignUpBotton";
import { Container } from "./Section";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "How It Works", href: "#how-it-works" },
        { name: "Services",     href: "#services" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "Plans",        href: "#plans" },
        { name: "FAQ",          href: "#faq" },
        { name: "Contact",      href: "#contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
            <Container>
                <div className="flex h-14 items-center justify-between sm:h-16">
                    {/* Logo */}
                    <Link to="/" className="flex min-h-11 shrink-0 items-center space-x-2">
                        <img src={logo} alt="logo" width="40" height="40" className="h-9 w-9 sm:h-10 sm:w-10" />
                        <span className="text-xl leading-5 font-bold font-archivo text-primary-500">
                            Likita24
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link
                            to="/auth/login"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                        >
                            Login
                        </Link>
                        <SignUpButton>
                            Book a Consultation
                        </SignUpButton>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:hidden"
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
            </Container>

            {/* Mobile Menu: full width sheet under the bar */}
            <div
                className={`lg:hidden overflow-hidden border-gray-100 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[85dvh] border-t opacity-100" : "max-h-0 opacity-0"
                    }`}
                aria-hidden={!isMobileMenuOpen}
            >
                <Container className="space-y-1 py-3">
                    <SignUpButton className="w-full" >
                        Book a Consultation
                    </SignUpButton>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex min-h-11 items-center rounded-lg px-3 text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                            tabIndex={isMobileMenuOpen ? 0 : -1}
                        >
                            {link.name}
                        </a>
                    ))}
                    <Link
                        to="/auth/login"
                        className="flex min-h-11 items-center rounded-lg px-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                        tabIndex={isMobileMenuOpen ? 0 : -1}
                    >
                        Login
                    </Link>
                </Container>
            </div>
        </nav>
    );
};

export default Navbar;
