import { MdOutlinePersonAddAlt1 } from "react-icons/md"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import SignUpButton from "@/shared/components/SignUpBotton"

const GetStarted = () => {
    return (
        <div className='w-full h-[500px] bg-neutral-100 flex flex-col items-center justify-center'>
            <h1 className="font-archivo text-3xl leading-10 font-bold text-neutral-900">Ready to Get Started?</h1>
            <p className='font-inter text-lg leading-7 font-normal text-neutral-500 py-10'>Begin your journey to convenient healthcare in just a few simple steps.</p>
            <div className="flex justify-between items-center gap-10">
                <div className="gap-4 flex flex-col items-center">
                    <MdOutlinePersonAddAlt1 className="text-secondary-500 font-bold w-15 h-15" />
                    <p className="font-archivo text-xl leading-7 font-semibold text-neutral-900">1. Register & Verify</p>
                </div>
                <div className="gap-4 flex flex-col items-center">
                    <IoMdCheckmarkCircleOutline className="text-secondary-500 font-bold w-15 h-15" />
                    <p className="font-archivo text-xl leading-7 font-semibold text-neutral-900">2. Book Your Consultation</p>
                </div>
            </div>
            <div className="py-10">
                <SignUpButton className="px-15">
                    Get Started Now
                </SignUpButton>
            </div>
        </div>
    )
}

export default GetStarted