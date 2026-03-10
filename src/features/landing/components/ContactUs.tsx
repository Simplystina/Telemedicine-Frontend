import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function ContactUs() {
    // Kano, Nigeria coordinates
    const kanoPosition: [number, number] = [12.0022, 8.5919];

    return (
        <div className="py-16 px-4 bg-neutral-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Contact Information */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="font-archivo text-3xl leading-tight font-bold text-neutral-900 mb-4">
                                Contact Us & Find Our Location
                            </h1>
                            <p className="font-inter text-lg text-neutral-600 leading-relaxed">
                                Whether you have a question, need support, or want to share feedback, we're here to help. Reach out through any of the channels below.
                            </p>
                        </div>

                        {/* Contact Details */}
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
                                    <p className="font-semibold text-neutral-900 font-inter text-lg">support@drmaliktelemedicine.ng</p>
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

                    {/* Right Column - Interactive Map */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="font-archivo text-2xl font-bold text-neutral-900 mb-4 text-center">
                            Serving patients worldwide through telemedicine
                        </h2>
                        <p className="text-center text-neutral-600 font-inter mb-6">
                            Our Headquarters in Kano, Nigeria
                        </p>

                        {/* Leaflet Map */}
                        <div className="h-[500px] rounded-xl overflow-hidden border-2 border-primary-200">
                            <MapContainer
                                center={kanoPosition}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Highlight circle around Kano */}
                                <Circle
                                    center={kanoPosition}
                                    radius={2000}
                                    pathOptions={{
                                        color: '#636AE8',
                                        fillColor: '#636AE8',
                                        fillOpacity: 0.2
                                    }}
                                />

                                {/* Marker at exact location */}
                                <Marker position={kanoPosition}>
                                    <Popup>
                                        <div className="text-center p-2">
                                            <h3 className="font-archivo font-bold text-lg text-neutral-900">Dr. Malik Telemedicine</h3>
                                            <p className="font-inter text-sm text-neutral-600 mt-1">15 Aminu Kano Way</p>
                                            <p className="font-inter text-sm text-neutral-600">Kano, Nigeria</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>

                        {/* Map Info */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-neutral-600 font-inter font-semibold">
                                🌍 Global Telemedicine Service | 📍 Based in Kano, Nigeria
                            </p>
                            <p className="text-xs text-neutral-500 font-inter mt-2">
                                Click the marker for office details • We serve patients everywhere
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;