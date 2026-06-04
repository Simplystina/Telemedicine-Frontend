import Navbar from "@/features/landing/components/Navbar";
import Header from "../components/Header";
import HowItWorks from "../components/HowItWorks";
import Services from "../components/Services";
import Testimonial from "../components/Testimonial";
import FlexiblePlan from "../components/FlexiblePlan";
import GetStarted from "../components/GetStarted";
import FAQ from "../components/FAQ";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-primary-100 flex flex-col">
            <Navbar />

            {/* Main Content - Add padding top to account for fixed navbar */}
            <main className="pt-0 flex-1">
                <div className="bg-primary-100">
                    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
                        <Header />
                    </div>
                </div>

                <div id="how-it-works" className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
                    <HowItWorks />
                </div>
                <div id="services">
                    <Services />
                </div>
                <div id="testimonials" className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
                    <Testimonial />
                </div>
                <div id="plans" className="bg-primary-100">
                    <FlexiblePlan />
                </div>
                <div className="">
                    <GetStarted />
                </div>
                <div id="faq">
                    <FAQ />
                </div>
                <div id="contact">
                    <ContactUs />
                </div>
            </main>

            {/* Footer - Will stick to bottom on short pages, scroll normally on long pages */}
            <Footer />
        </div>
    );
};

export default LandingPage;