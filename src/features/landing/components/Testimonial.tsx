import TestimonialCard from "./TestimonialCard"
import { Section, SectionHeading } from "./Section"
import image from "@assets/ServicesImage.webp"

const testimonials = [
    {
        image: image,
        name: "Aisha Lawal",
        location: "Kano, Nigeria",
        testimonial: "Likita24 made it so easy to get a prescription. Quick, professional, and no need to leave my home."
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

function Testimonial() {
    return (
        <Section id="testimonials">
            <SectionHeading
                title="What Our Patients Say"
                description="Real stories from patients across Kano and beyond."
            />

            {/* Mobile: swipeable scroll-snap carousel bleeding to the screen edge. lg+: 3-column grid. */}
            <div
                className="scrollbar-hide -mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-4 px-4 pb-1 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                role="list"
            >
                {testimonials.map((t) => (
                    <div key={t.name} role="listitem" className="min-w-[85%] shrink-0 snap-center sm:min-w-[22rem] lg:min-w-0">
                        <TestimonialCard
                            testimonial={t.testimonial}
                            name={t.name}
                            location={t.location}
                            image={t.image}
                        />
                    </div>
                ))}
            </div>
        </Section>
    )
}

export default Testimonial
