import doctor from "@/assets/doctor.webp"
import SignUpButton from '@/shared/components/SignUpBotton'
import { GrLocation } from "react-icons/gr";
import { Container } from "./Section";

function Header() {
    return (
        <div className="bg-primary-100 pt-14 sm:pt-16">
            <Container className="grid items-center gap-6 pt-6 pb-10 sm:pt-10 lg:grid-cols-2 lg:gap-12 lg:pt-16 lg:pb-20">
                <div className='flex flex-col items-center space-y-3 text-center sm:space-y-4 lg:items-start lg:text-left'>
                    <h1 className='max-w-md font-archivo text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl'>
                        Reduce Unnecessary Hospital Visits
                    </h1>
                    <p className='max-w-xl font-inter text-base font-normal leading-relaxed text-neutral-500'>
                        Get expert medical advice from the comfort of your home with Likita24. Skip the waiting rooms and connect with qualified healthcare professionals instantly.
                    </p>
                    <SignUpButton className='w-full px-8 sm:w-auto'>
                        Book a Consultation
                    </SignUpButton>
                    <div className='flex items-center gap-2'>
                        <span className='text-neutral-500'>
                            <GrLocation />
                        </span>
                        <p className='font-inter text-sm font-normal text-neutral-500 leading-normal'>Serving Kano and beyond, Nigeria</p>
                    </div>
                </div>
                <div className='flex justify-center lg:justify-end'>
                    <img
                        src={doctor}
                        alt="doctor"
                        fetchPriority="high"
                        width={608}
                        height={724}
                        className='aspect-[4/3] max-h-72 w-full max-w-[608px] rounded-2xl object-cover object-top shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_17px_35px_rgba(23,26,31,0.24)] sm:max-h-96 lg:aspect-auto lg:max-h-[560px]'
                    />
                </div>
            </Container>
        </div>
    )
}

export default Header
