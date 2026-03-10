import Logo from "@assets/Logo.png"
function Footer() {
    const footerLinks = [
        "About Us",
        "Contact Us",
        "Services",
        "Privacy Policy",
        "Terms of Service"
    ]
    return (
        <footer className="bg-neutral-700  pb-20 pt-20">
            <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                    <div className="flex justify-between w-full">
                        <div className="flex justify-center items-center">
                            <img src={Logo} alt="" className="w-[50px] h-[50px]" />
                            <h2 className="font-poppins text-2xl leading-10 font-bold text-white">Dr. Abdumalik Telemedicine</h2>
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            {footerLinks.map((link, index) => (
                                <a key={index} href="#" className="text-neutral-300 hover:text-white transition-colors">
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <p className="text-neutral-400 hover:text-neutral-200 transition-colors">{new Date().getFullYear()} - Dr. Abdumalik Telemedicine. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer