import type { ReactNode } from 'react';
import AuthPatientImage from '@assets/AuthPatientImage.webp';
interface AuthLayoutProps {
    children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="h-screen w-full flex overflow-hidden bg-white">
            {/* Left Side: Image (Visible on lg screens) */}
            <div className="hidden lg:block lg:w-1/2 relative h-full overflow-hidden">
                <div className="absolute inset-0 bg-primary-600/10 z-10"></div> {/* Soft overlay */}
                <img
                    src={AuthPatientImage}
                    alt="Healthcare Professional"
                    loading="lazy"
                    width={800}
                    height={1200}
                    className="w-full h-full object-cover animate-fade-in-up"
                    style={{ animationDuration: '1s' }}
                />

                {/* Decorative floating elements on top of image */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl animate-pulse z-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000 z-20"></div>

                {/* Branding on image side if needed, or just keep it clean */}
                <div className="absolute bottom-12 left-12 z-30">
                    <h3 className="text-white text-3xl font-archivo font-bold drop-shadow-lg">
                        Quality Healthcare<br />at Your Fingertips
                    </h3>
                </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto bg-linear-to-br from-primary-50 via-white to-primary-100 px-4 py-8 lg:px-6 ">
                <div className="w-full  animate-fade-in-up">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
