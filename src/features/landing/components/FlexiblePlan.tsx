import FlexiblePlanCards from './FlexiblePlanCards'

const FlexiblePlan = () => {

    const plans = [
        {
            title: "Basic Consult",
            price: "₦5,000",
            duration: "/month",
            features: [
                "Single Video/Chat Consultation",
                "Basic Health Advice",
                "Digital Prescription",
                "Access to General Practitioners",
                "24/7 Support (Email)"
            ],
        },
        {
            title: "Standard Care",
            price: "₦5,000",
            duration: "/month",
            features: [
                "3 Consultations per Month",
                "Priority Booking",
                "Access to Specialist Doctors",
                "Digital Health Records",
                "Report Upload & Review",
                "Personalized Health Tips"
            ],
        },
        {
            title: "Premium Wellness",
            price: "₦12,000",
            duration: "/month",
            features: [
                "Unlimited Consultations",
                "Priority Booking",
                "Access to Specialist Doctors",
                "Dedicated Health Coordinator",
                "Comprehensive Medical Records",
                "24/7 Support (Phone, Chat, Email)"
            ],
        },
    ]
    return (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20 lg:py-32 px-4">
            <h1 className="text-center font-archivo text-2xl md:text-3xl lg:text-4xl leading-tight font-bold text-neutral-900">Our Flexible Plans</h1>
            <p className="text-center mx-auto pb-12 pt-5 max-w-xl font-inter text-lg leading-7 font-normal text-neutral-500">Connecting you with highly qualified medical professionals across various fields. Experience expert care from the comfort of your home.</p>
            <div className='flex flex-col lg:flex-row gap-8 w-full items-center justify-center'>
                {plans.map((plan) => (
                    <FlexiblePlanCards key={plan.title} plan={plan} />
                ))}
            </div>
        </div>
    )
}

export default FlexiblePlan