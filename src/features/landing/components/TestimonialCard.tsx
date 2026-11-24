import { RxAvatar } from "react-icons/rx"
import type { TestimonialProps } from "../types"

function TestimonialCard({ testimonial, name, location, image }: TestimonialProps) {
    return (
        <div className="flex h-full w-full animate-slide-in-right flex-col justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_4px_9px_rgba(23,26,31,0.11)] transition-shadow duration-300 hover:shadow-[0px_0px_4px_rgba(23,26,31,0.15),0px_6px_12px_rgba(23,26,31,0.14)] sm:p-5 lg:p-6">
            <p className="text-neutral-500 font-inter italic text-base leading-relaxed font-normal">{testimonial}</p>
            <div className="flex items-center gap-3">
                {image ? (
                    <img src={image} alt={`${name} avatar`} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                    <RxAvatar className="h-11 w-11 text-neutral-400" />
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
