import { MdOutlinePersonAddAlt1 } from "react-icons/md"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import SignUpButton from "@/shared/components/SignUpBotton"

const GetStarted = () => {
    return (
        <div className='w-full py-20 lg:py-32 bg-neutral-100 flex flex-col items-center justify-center px-4'>
            <h1 className="font-archivo text-3xl lg:text-4xl leading-tight font-bold text-neutral-900 text-center">Ready to Get Started?</h1>
            <p className='font-inter text-lg leading-7 font-normal text-neutral-500 py-10 text-center max-w-xl'>Begin your journey to convenient healthcare in just a few simple steps.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-10 lg:gap-20">
                <div className="gap-4 flex flex-col items-center">
                    <MdOutlinePersonAddAlt1 className="text-secondary-500 font-bold w-12 h-12 lg:w-16 lg:h-16" />
                    <p className="font-archivo text-xl leading-7 font-semibold text-neutral-900">1. Register & Verify</p>
                </div>
                <div className="gap-4 flex flex-col items-center">
                    <IoMdCheckmarkCircleOutline className="text-secondary-500 font-bold w-12 h-12 lg:w-16 lg:h-16" />
                    <p className="font-archivo text-xl leading-7 font-semibold text-neutral-900">2. Book Your Consultation</p>
                </div>
            </div>
            <div className="pt-12">
                <SignUpButton className="px-15">
                    Get Started Now
                </SignUpButton>
            </div>
        </div>
    )
}

export default GetStarted