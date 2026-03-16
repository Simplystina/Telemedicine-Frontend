import ServicesImg from "@assets/ServicesImage.png"

function Services() {

    const services = [
        "General practitioner",
        "Psychiatrist",
        "Gynaecologist",
        "Pedeatrician",
        "Gyneacology",
        "Dermatology",
        "Cardiologist",
        "Endocrinologist",
        "Urologist",
        "Ophthalmologist",
        ""

    ]
    return (
        <div className="bg-neutral-100 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-16 lg:py-24 px-4 overflow-hidden">
            <div className="w-full max-w-lg lg:w-1/2 flex justify-center lg:justify-end">
                <img src={ServicesImg} alt="services image" className="w-full h-auto max-w-md lg:max-w-none" />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                <h1 className="font-archivo text-2xl md:text-3xl lg:text-4xl leading-tight font-bold text-neutral-900">Our Services & Specialities</h1>
                <p className="pb-8 pt-6 max-w-xl font-inter text-lg leading-7 font-normal text-neutral-500">Connecting you with highly qualified medical professionals across various fields. Experience expert care from the comfort of your home.</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-2 max-w-xl">
                    {
                        services.filter(item => item.trim() !== "").map((item, index) => {
                            return (
                                <span
                                    key={index}
                                    className="inline-flex h-[42px] px-5 items-center justify-center rounded-full bg-white border border-gray-200 font-inter text-base leading-[26px] font-medium shadow-sm transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 active:scale-95 cursor-pointer"
                                >
                                    {item}
                                </span>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Services
