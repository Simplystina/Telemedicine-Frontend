import Card from './Card'
import { Section, SectionHeading } from './Section'
import BrowseDoctorsIcon from "@assets/browseDoctorsIcon.png"
import BookAppointmentIcon from "@assets/BookAppointementIcon.webp"
import ConsultOnlineIcon from "@assets/ConsultOnlineIcon.png"
import ChatWithDoctorIcon from "@assets/ChatWithDrIcon.png"
function HowItWorks() {

    const cardItems = [
        {
            icon: BrowseDoctorsIcon,
            heading: "Browse Doctors",
            text: "Find certified medical professionals with diverse specialities."
        },
        {
            icon: BookAppointmentIcon,
            heading: "Book Appointment",
            text: "Schedule a convenient time for your remote consultation."
        },
        {
            icon: ConsultOnlineIcon,
            heading: "Consult Online",
            text: "Connect with your doctor via secure video or chat."
        },
        {
            icon: ChatWithDoctorIcon,
            heading: "Chat With Doctors",
            text: "Securely share medical reports for accurate diagnosis."
        }
    ]
    return (
        <Section id="how-it-works">
            <SectionHeading
                title="How it works"
                description="Get expert medical advice from the comfort of your home with Likita24. Skip the waiting rooms and connect with qualified healthcare professionals instantly."
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                {cardItems.map((item, index) => (
                    <Card key={item.heading} browseDoctors={item.icon} heading={item.heading} text={item.text} step={index + 1} />
                ))}
            </div>
        </Section>
    )
}

export default HowItWorks
