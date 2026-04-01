import { useRef, useEffect } from "react"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import TestimonialCard from "./TestimonialCard"
import image from "@assets/ServicesImage.webp"

function Testimonial() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const autoScrollIntervalRef = useRef<number | null>(null)

    const testimonials = [
        {
            image: image,
            name: "Aisha Lawal",
            location: "Kano, Nigeria",
            testimonial: "Dr. Malik ` made it so easy to get a prescription. Quick, professional, and no need to leave my home."
        },
        {
            image: image,
            name: "Musa Abubakar",
            location: "Kano, Nigeria",
            testimonial: "Excellent service! I consulted a psychiatrist for my anxiety and felt truly heard. Highly recommend for discreet support."
        },
        {
            image: "",
            name: "Fatima Bello",
            location: "Kano, Nigeria",
            testimonial: "The gynaecologist I saw was very thorough and compassionate. It saved me a trip to the hospital, which is a huge relief."
        }
    ]

    // Duplicate testimonials for infinite scroll effect
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials]

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400 // Scroll by approximately one card width + gap
            const newScrollPosition = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount

            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            })
        }
    }

    const handleInfiniteScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const cardWidth = 400 // Card width (374px) + gap (26px)
            const totalWidth = cardWidth * testimonials.length

            // If scrolled to the end, jump back to the middle set
            if (container.scrollLeft >= totalWidth * 2) {
                container.scrollLeft = totalWidth
            }
            // If scrolled to the beginning, jump to the middle set
            else if (container.scrollLeft <= 0) {
                container.scrollLeft = totalWidth
            }
        }
    }

    const startAutoScroll = () => {
        autoScrollIntervalRef.current = setInterval(() => {
            scroll('right')
        }, 3000) // Auto-scroll every 3 seconds
    }

    const stopAutoScroll = () => {
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current)
            autoScrollIntervalRef.current = null
        }
    }

    useEffect(() => {
        // Set initial scroll position to the middle set
        if (scrollContainerRef.current) {
            const cardWidth = 400
            scrollContainerRef.current.scrollLeft = cardWidth * testimonials.length
        }

        // Start auto-scroll
        startAutoScroll()

        // Add scroll event listener for infinite loop
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', handleInfiniteScroll)
        }

        // Cleanup
        return () => {
            stopAutoScroll()
            if (container) {
                container.removeEventListener('scroll', handleInfiniteScroll)
            }
        }
    }, [])

    return (
        <div className="relative py-20">
            <h1 className="pt-10 text-center font-archivo text-2xl md:text-3xl lg:text-4xl leading-10 font-bold text-neutral-900">What Our Patients Say</h1>
            <p className="text-center mx-auto pb-5 pt-10 px-4 max-w-xl font-inter text-lg leading-7 font-normal text-neutral-500">Connecting you with highly qualified medical professionals across various fields. Experience expert care from the comfort of your home.</p>

            {/* Carousel Container */}
            <div
                className="relative pt-10 pb-20"
                onMouseEnter={stopAutoScroll}
                onMouseLeave={startAutoScroll}
            >
                {/* Previous Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-neutral-100 transition-colors"
                    aria-label="Previous testimonials"
                >
                    <IoChevronBack className="w-6 h-6 text-neutral-700" />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-12"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {duplicatedTestimonials.map((testimonial, index) => (
                        <div key={index} className="shrink-0">
                            <TestimonialCard
                                testimonial={testimonial.testimonial}
                                name={testimonial.name}
                                location={testimonial.location}
                                image={testimonial.image}
                            />
                        </div>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-neutral-100 transition-colors"
                    aria-label="Next testimonials"
                >
                    <IoChevronForward className="w-6 h-6 text-neutral-700" />
                </button>
            </div>
        </div>
    )
}

export default Testimonial