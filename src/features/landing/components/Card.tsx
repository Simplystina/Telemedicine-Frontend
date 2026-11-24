import type { CardProps } from "../types"
function Card({ browseDoctors, heading, text, step }: CardProps & { step?: number }) {

    return (
        <div className="relative flex h-full flex-col items-center space-y-2 rounded-2xl bg-white p-4 text-center shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_2px_5px_rgba(23,26,31,0.09)] sm:p-5 lg:p-6">
            {step !== undefined && (
                <span className="absolute left-3 top-3 font-archivo text-xs font-bold text-primary-500" aria-hidden="true">
                    {String(step).padStart(2, "0")}
                </span>
            )}
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 sm:h-14 sm:w-14">
                <img src={browseDoctors} alt="" className="h-6 w-6 object-contain sm:h-8 sm:w-8" />
            </span>
            <h3 className="font-archivo text-sm font-semibold leading-tight text-neutral-900 sm:text-base">{heading}</h3>
            <p className="font-inter text-xs leading-normal text-neutral-500 sm:text-sm">{text}</p>
        </div>
    )
}


export default Card
