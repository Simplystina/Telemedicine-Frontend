import doctor from "@/assets/doctor.png"
import SignUpButton from '@/shared/components/SignUpBotton'
import { GrLocation } from "react-icons/gr";

function Header() {
    return (
        <div className='pt-32 lg:pt-40 pb-10 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-0 min-h-auto lg:min-h-[724px]'>
            <div className='text-center lg:text-left flex flex-col items-center lg:items-start'>
                <h1 className='lg:pt-15 font-archivo text-4xl lg:text-[48px] max-w-sm lg:w-[348px] font-extrabold text-neutral-900 leading-tight lg:leading-[60px]'>
                    Reduce Unnecessary Hospital Visits
                </h1>
                <p className='font-inter text-base font-normal text-neutral-500 mt-5 max-w-lg lg:w-[508px] leading-[29px]'>
                    Get expert medical advice from the comfort of your home with Dr. Malik Telemedicine. Skip the waiting rooms and connect with qualified healthcare professionals instantly.
                </p>
                <div className='pt-5 pb-10'>
                    <SignUpButton className='px-10'>
                        Book a Consultation
                    </SignUpButton>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='text-neutral-500'>
                        <GrLocation />
                    </span>
                    <p className='font-inter text-sm font-normal text-neutral-500 leading-normal'>Serving Kano and beyond, Nigeria</p>
                </div>
            </div>
            <div className='w-full lg:w-auto flex justify-center'>
                <img src={doctor} alt="doctor" className='w-full max-w-[608px] h-auto rounded-2xl shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_17px_35px_rgba(23,26,31,0.24)]' />
            </div>
        </div>
    )
}

export default Header