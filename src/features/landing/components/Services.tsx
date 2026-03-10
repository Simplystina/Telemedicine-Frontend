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
        <div className="bg-neutral-100 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 py-20">
            <div>
                <img src={ServicesImg} alt="services image" />
            </div>
            <div>
                <h1 className="font-archivo text-3xl leading-10 font-bold text-neutral-900">Our Services & Specialities</h1>
                <p className="pb-5 pt-10 w-[555px] font-inter text-lg leading-7 font-normal text-neutral-500">Connecting you with highly qualified medical professionals across various fields. Experience expert care from the comfort of your home.</p>
                <div className="flex flex-wrap gap-2 mt-2 max-w-[555px]">
                    {
                        services.filter(item => item.trim() !== "").map((item, index) => {
                            return (
                                <span
                                    key={index}
                                    className="inline-flex h-[42px] px-3 items-center justify-center rounded-full bg-[#F3F4F6] border border-gray-200 font-inter text-base leading-[26px] font-semibold transition-all hover:bg-neutral-650 hover:text-white hover:border-neutral-650 active:bg-neutral-700 active:text-white cursor-pointer"
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
