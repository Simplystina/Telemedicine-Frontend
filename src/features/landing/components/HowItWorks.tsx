import Card from './Card'
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
        <div className='py-20 lg:py-32 px-4'>
            <h1 className='font-archivo text-2xl md:text-3xl lg:text-[36px] font-bold text-neutral-900 leading-tight text-center'>How it works</h1>
            <p className='font-inter text-base font-normal max-w-2xl mx-auto text-neutral-500 leading-normal mt-5 text-center'>
                Get expert medical advice from the comfort of your home with Dr. Malik Telemedicine. Skip the waiting rooms and connect with qualified healthcare professionals instantly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 pt-16">
                {cardItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-center">
                        <Card browseDoctors={item.icon} heading={item.heading} text={item.text} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HowItWorks
