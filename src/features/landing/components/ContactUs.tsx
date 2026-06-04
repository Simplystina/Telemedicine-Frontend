function ContactUs() {
    return (
        <div className="py-16 px-4 bg-neutral-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Contact Information */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="font-archivo text-2xl md:text-3xl lg:text-4xl leading-tight font-bold text-neutral-900 mb-4">
                                Contact Us & Find Our Location
                            </h1>
                            <p className="font-inter text-lg text-neutral-600 leading-relaxed">
                                Whether you have a question, need support, or want to share feedback, we're here to help. Reach out through any of the channels below.
                            </p>
                        </div>

                        <div className="space-y-4 mt-8">
                            {/* Phone */}
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 font-inter">Phone</p>
                                    <p className="font-semibold text-neutral-900 font-inter text-lg">+234 800 123 4567</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 font-inter">Email</p>
                                    <p className="font-semibold text-neutral-900 font-inter text-sm sm:text-base md:text-lg break-all">support@drmaliktelemedicine.ng</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 font-inter">Address</p>
                                    <p className="font-semibold text-neutral-900 font-inter text-lg">15 Aminu Kano Way, Kano, Nigeria</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Location Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Stylised location graphic */}
                        <div className="relative bg-linear-to-br from-primary-100 to-primary-200 h-64 flex items-center justify-center">
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: 'linear-gradient(#636AE8 1px, transparent 1px), linear-gradient(90deg, #636AE8 1px, transparent 1px)',
                                    backgroundSize: '40px 40px',
                                }}
                            />
                            <div className="relative flex flex-col items-center">
                                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                                <div className="bg-white rounded-xl px-6 py-3 shadow-md text-center">
                                    <p className="font-archivo font-bold text-neutral-900">Dr. Malik Telemedicine</p>
                                    <p className="font-inter text-sm text-neutral-600">15 Aminu Kano Way, Kano</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="font-archivo text-xl font-bold text-neutral-900 mb-2 text-center">
                                Serving patients worldwide through telemedicine
                            </h2>
                            <p className="text-center text-neutral-600 font-inter text-sm mb-5">
                                Our Headquarters in Kano, Nigeria
                            </p>
                            <a
                                href="https://www.google.com/maps/search/15+Aminu+Kano+Way,+Kano,+Nigeria"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold font-inter text-sm rounded-xl transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View on Google Maps
                            </a>
                            <p className="text-xs text-center text-neutral-500 font-inter mt-3">
                                🌍 Global Telemedicine Service · 📍 Based in Kano, Nigeria
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
