import { RxAvatar } from "react-icons/rx"
import type { TestimonialProps } from "../types"

function TestimonialCard({ testimonial, name, location, image }: TestimonialProps) {
    return (
        <div className="w-full max-w-[380px] min-h-[260px] bg-white rounded-2xl shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_4px_9px_rgba(23,26,31,0.11)] p-8 animate-slide-in-right hover:shadow-[0px_0px_4px_rgba(23,26,31,0.15),0px_6px_12px_rgba(23,26,31,0.14)] transition-shadow duration-300 flex flex-col justify-between mx-auto">
            <p className="text-neutral-500 font-inter italic text-lg leading-7 font-normal">{testimonial}</p>
            <div className="flex items-center gap-3">
                {image ? (
                    <img src={image} alt={`${name} avatar`} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <RxAvatar className="w-12 h-12 text-neutral-400" />
                )}
                <div className="flex flex-col">
                    <h3 className="font-inter text-base leading-6 font-semibold text-neutral-900">{name}</h3>
                    <p className="font-inter text-sm leading-5 font-normal text-neutral-500">{location}</p>
                </div>
            </div>
        </div>
    )
}

export default TestimonialCard