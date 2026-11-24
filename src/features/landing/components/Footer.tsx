import { Link } from "react-router-dom";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Logo from "@/assets/logo.png";
import { Container } from "./Section";
import SignUpButton from "@/shared/components/SignUpBotton";

const companyLinks = [
    { name: "About Us", href: "/" },
    { name: "Contact Us", href: "/#contact" },
    { name: "FAQ", href: "/#faq" },
];

const serviceLinks = [
    { name: "Services", href: "/#services" },
    { name: "Plans", href: "/#plans" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Testimonials", href: "/#testimonials" },
];

const contactItems = [
    { icon: FiMail, label: "support@likita24.com", href: "mailto:support@likita24.com" },
    { icon: FiPhone, label: "+234 800 123 4567", href: "tel:+2348001234567" },
    { icon: FiMapPin, label: "Kano, Nigeria" },
];

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 rounded";
const linkClass = `flex min-h-11 items-center text-sm text-primary-100/70 transition-colors hover:text-white ${focusRing}`;
const headingClass = "font-poppins text-sm font-semibold uppercase tracking-wider text-white";

function Footer() {
    return (
        <footer className="relative overflow-hidden rounded-t-[2rem] bg-linear-to-br from-primary-950 via-primary-900 to-primary-950 font-inter">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(140,148,240,0.25),transparent_50%)]"
            />

            {/* Same container as the navbar and page sections so the logos line up */}
            <Container className="relative">
                <div className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-12 lg:py-16">
                    {/* CTA strip: top on desktop, after the brand block on mobile */}
                    <div className="order-2 flex flex-col gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between lg:order-1 lg:col-span-12">
                        <p className="font-archivo text-xl font-bold text-white">
                            Ready to talk to a doctor?
                        </p>
                        <SignUpButton className="w-full shrink-0 sm:w-auto sm:px-6">
                            Book a Consultation
                        </SignUpButton>
                    </div>

                    {/* Brand */}
                    <div className="order-1 lg:order-2 lg:col-span-4">
                        <Link
                            to="/"
                            aria-label="Likita24 home"
                            className={`inline-flex min-h-11 items-center space-x-2 ${focusRing}`}
                        >
                            <img src={Logo} alt="" width="40" height="40" className="h-10 w-10" />
                            <span className="font-archivo text-xl font-bold leading-5 text-white">
                                Likita24
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-100/70">
                            Quality healthcare at your fingertips. Verified doctors, secure consultations.
                        </p>
                    </div>

                    {/* Link columns */}
                    <nav
                        aria-label="Footer"
                        className="order-3 grid grid-cols-2 gap-x-6 lg:col-span-4"
                    >
                        <div>
                            <h2 className={headingClass}>Company</h2>
                            <ul className="mt-3 space-y-0.5">
                                {companyLinks.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className={linkClass}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className={headingClass}>Services</h2>
                            <ul className="mt-3 space-y-0.5">
                                {serviceLinks.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className={linkClass}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>

                    {/* Contact */}
                    <div className="order-4 lg:col-span-4">
                        <h2 className={headingClass}>Contact</h2>
                        <ul className="mt-3 space-y-3">
                            {contactItems.map(({ icon: Icon, label, href }) => {
                                const content = (
                                    <>
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-primary-200">
                                            <Icon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        <span className="text-sm">{label}</span>
                                    </>
                                );
                                return (
                                    <li key={label}>
                                        {href ? (
                                            <a
                                                href={href}
                                                className={`flex min-h-11 items-center gap-3 text-primary-100/70 transition-colors hover:text-white ${focusRing}`}
                                            >
                                                {content}
                                            </a>
                                        ) : (
                                            <div className="flex min-h-11 items-center gap-3 text-primary-100/70">
                                                {content}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col-reverse gap-2 border-t border-white/10 py-6 text-sm text-primary-200/80 lg:flex-row lg:items-center lg:justify-between">
                    <p>&copy; {new Date().getFullYear()} Likita24. All rights reserved.</p>
                    <ul className="flex flex-col lg:flex-row lg:gap-6">
                        <li>
                            <a href="/" className={`flex min-h-11 items-center transition-colors hover:text-white ${focusRing}`}>
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="/" className={`flex min-h-11 items-center transition-colors hover:text-white ${focusRing}`}>
                                Terms of Service
                            </a>
                        </li>
                    </ul>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
