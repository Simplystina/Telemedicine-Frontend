import Logo from "@assets/logo.png"
function Footer() {
    const footerLinks = [
        { name: "About Us",          href: "/" },
        { name: "Contact Us",        href: "/#contact" },
        { name: "Services",          href: "/#services" },
        { name: "Privacy Policy",    href: "/" },
        { name: "Terms of Service",  href: "/" },
    ];
    return (
        <footer className="bg-neutral-800 pb-16 pt-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col lg:flex-row items-center gap-4 text-center lg:text-left">
                             <img 
                                src={Logo} 
                                alt="logo" 
                                loading="lazy"
                                width="48"
                                height="48"
                                className="w-12 h-12 brightness-0 invert" 
                            />
                            <h2 className="font-poppins text-2xl font-bold text-white">Dr. Malik Telemedicine</h2>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                            {footerLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-neutral-400 hover:text-white transition-colors font-medium">
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="pt-8 border-t border-neutral-700 text-center">
                        <p className="text-neutral-500 text-sm">
                            &copy; {new Date().getFullYear()} Dr. Malik Telemedicine. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer