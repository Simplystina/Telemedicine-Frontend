import type { IconType } from "react-icons"
import { FaBaby, FaBrain, FaEye, FaFemale, FaHeartbeat, FaMicroscope, FaTint, FaUserMd, FaVial } from "react-icons/fa"
import ServicesImg from "@assets/ServicesImage.webp"
import { Section, SectionHeading } from "./Section"

const services: { name: string; icon: IconType }[] = [
    { name: "General practitioner", icon: FaUserMd },
    { name: "Psychiatrist", icon: FaBrain },
    { name: "Gynaecologist", icon: FaFemale },
    { name: "Paediatrician", icon: FaBaby },
    { name: "Dermatology", icon: FaMicroscope },
    { name: "Cardiologist", icon: FaHeartbeat },
    { name: "Endocrinologist", icon: FaVial },
    { name: "Urologist", icon: FaTint },
    { name: "Ophthalmologist", icon: FaEye },
]

function Services() {
    return (
        <Section id="services" className="overflow-hidden bg-neutral-100" containerClassName="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
            <div className="flex w-full max-w-xs justify-center sm:max-w-sm lg:w-5/12 lg:max-w-none lg:justify-start">
                <img
                    src={ServicesImg}
                    alt="services image"
                    loading="lazy"
                    width={448}
                    height={448}
                    className="h-auto w-full max-w-md"
                />
            </div>
            <div className="w-full lg:w-7/12">
                <SectionHeading
                    align="left"
                    title="Our Services & Specialities"
                    description="Specialists across every field, available online."
                    className="mb-5 lg:mb-6"
                />
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
                    {services.map(({ name, icon: Icon }) => (
                        <li
                            key={name}
                            className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-colors hover:border-primary-500 hover:bg-primary-50"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="font-inter text-sm font-medium leading-tight text-neutral-900">{name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    )
}

export default Services
