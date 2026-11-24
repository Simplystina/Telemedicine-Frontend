import { useState } from 'react';
import { faqData } from '../data';
import { Section, SectionHeading } from './Section';

function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Section id="faq">
            <SectionHeading title="Frequently Asked Questions" />

            <div className="mx-auto max-w-3xl space-y-3">
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-md"
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            aria-expanded={openIndex === index}
                            className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-3 text-left font-inter text-base sm:py-4 font-semibold leading-snug text-neutral-900 transition-colors duration-200 sm:px-5"
                        >
                            <span>{faq.question}</span>
                            <svg
                                className={`h-4 w-4 shrink-0 fill-neutral-900 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                        >
                            <div className="bg-gray-50 px-4 py-3 text-sm leading-relaxed sm:text-base text-gray-700 sm:px-5">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    )
}

export default FAQ;
