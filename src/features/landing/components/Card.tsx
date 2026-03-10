import type { CardProps } from "../types"
function Card({browseDoctors, heading, text}: CardProps) {

    return (
        <div className="p-10 flex flex-col items-center justify-center bg-white rounded-2xl shadow-[0px_0px_2px_rgba(23,26,31,0.12),0px_2px_5px_rgba(23,26,31,0.09)]">
            <img src={browseDoctors} alt="" />
            <h1 className="text-center font-archivo text-xl pt-3 pb-3 font-semibold text-neutral-900 leading-tight">{heading}</h1>
            <p className="text-center font-inter text-base font-normal text-neutral-500 leading-normal w-[198px]">{text}</p>
        </div>
    )
}


export default Card