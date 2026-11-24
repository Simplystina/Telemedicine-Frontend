import { MdOutlinePersonAddAlt1 } from "react-icons/md"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import SignUpButton from "@/shared/components/SignUpBotton"
import { Section } from "./Section"

const steps = [
    { icon: MdOutlinePersonAddAlt1, label: "1. Register & Verify" },
    { icon: IoMdCheckmarkCircleOutline, label: "2. Book Your Consultation" },
]

const GetStarted = () => {
    return (
        <Section className="bg-neutral-100">
            <div className="rounded-2xl bg-white p-5 text-center shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_2px_5px_rgba(23,26,31,0.09)] sm:p-8 lg:p-10">
                <h2 className="font-archivo text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">Ready to Get Started?</h2>
                <p className="mx-auto mt-2 max-w-2xl font-inter text-sm leading-relaxed text-neutral-500 sm:text-base">
                    Begin your journey to convenient healthcare in just a few simple steps.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:mx-auto lg:max-w-2xl">
                    {steps.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center justify-center gap-3 rounded-xl bg-primary-50 p-3">
                            <Icon className="h-8 w-8 shrink-0 text-secondary-500" aria-hidden="true" />
                            <p className="font-archivo text-base font-semibold leading-tight text-neutral-900">{label}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex justify-center sm:mt-6">
                    <SignUpButton className="w-full sm:w-auto sm:px-10">
                        Get Started Now
                    </SignUpButton>
                </div>
            </div>
        </Section>
    )
}

export default GetStarted
