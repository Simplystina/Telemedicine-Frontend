import SignUpButton from '@/shared/components/SignUpBotton'
import { IoMdCheckmark } from "react-icons/io"
const FlexiblePlanCards = ({ plan }: { plan: any }) => {
    const { title, price, duration, features } = plan;

    return (
        <div className="w-[394px] h-[456px] bg-white rounded-2xl shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_8px_17px_rgba(23,26,31,0.15)] p-6 flex flex-col justify-between transition-all duration-300 hover:bg-primary-100 hover:border-2 hover:border-primary-500 hover:scale-105 cursor-pointer">
            <div>
                <h1 className="pb-5 font-archivo text-2xl leading-10 font-bold text-neutral-900">{title}</h1>
                <span className="flex items-center gap-2">
                    <h1 className='font-archivo text-4xl leading-[30px] font-extrabold text-primary-500'>{price}</h1>
                    <p className='font-archivo text-4xl leading-[30px] font-extrabold text-neutral-500'>{duration}</p>
                </span>
                <div className='flex flex-col gap-2 pt-5'>
                    {features.map((feature: string) => (
                        <div className="flex items-center gap-2">
                            <span className='font-inter text-base leading-[24px] font-extrabold text-primary-500'><IoMdCheckmark /></span>
                            <p className='font-inter text-base leading-[24px] font-normal text-neutral-500'>{feature}</p>
                        </div>
                    ))}
                </div>
            </div>
            <SignUpButton className="w-full">
                choose plan
            </SignUpButton>
        </div>
    )
}

export default FlexiblePlanCards