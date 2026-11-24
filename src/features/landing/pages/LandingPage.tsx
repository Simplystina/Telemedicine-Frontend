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
                <Header />
                <HowItWorks />
                <Services />
                <Testimonial />
                <FlexiblePlan />
                <GetStarted />
                <FAQ />
                <ContactUs />
            </main>

            {/* Footer - Will stick to bottom on short pages, scroll normally on long pages */}
            <Footer />
        </div>
    );
};

export default LandingPage;