import { useState } from 'react';
import { faqData } from '../data';

function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
                <h1 className="text-center font-archivo text-2xl md:text-3xl lg:text-[36px] leading-[40px] font-bold text-neutral-900">
                    Frequently Asked Questions
                </h1>

                <div className="mt-32 space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                disabled={false}
                                className="py-5 px-5 flex  item-center justify-between w-full font-inter text-md leading-3 font-semibold text-neutral-900 bg-transparent opacity-100 border-none rounded-none  hover:text-neutral-900 hover:bg-transparent active:text-neutral-900 active:bg-transparent disabled:opacity-40 transition-colors duration-200"
                            >
                                <span className="text-left">
                                    {faq.question}
                                </span>
                                <span className="text-right">
                                    <svg
                                        className={`w-4 h-4 fill-neutral-900 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FAQ;