import { FiCheck, FiClock, FiLock, FiShield } from 'react-icons/fi'
import SignUpButton from '@/shared/components/SignUpBotton'
import { Section, SectionHeading } from './Section'

// Single source of truth for the plan: edit price and benefits here.
const plan = {
    name: "Likita24 Plan",
    price: 1000,
    currency: "₦",
    period: "month",
    benefits: [
        "Video and chat consultations with doctors",
        "Access to general practitioners and specialist doctors",
        "Priority booking",
        "Digital prescriptions",
        "Basic health advice and personalized health tips",
        "Digital health records",
        "Report upload and review",
        "24/7 email support",
    ],
    cta: "Get Started",
}

const trustPoints = [
    { icon: FiShield, label: "Verified doctors" },
    { icon: FiLock, label: "Secure and private" },
    { icon: FiClock, label: "Available 24/7" },
]

const FlexiblePlan = () => {
    return (
        <Section id="plans" className="bg-primary-100" containerClassName="grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
                <SectionHeading
                    align="left"
                    title="One simple plan"
                    description="Everything you need to see a doctor, for one low monthly price."
                    className="mb-0 lg:mb-6"
                />
                <ul className="hidden space-y-3 lg:block">
                    {trustPoints.map(({ icon: Icon, label }) => (
                        <li key={label} className="flex items-center gap-3 font-inter text-base font-medium text-neutral-900">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-500 shadow-sm">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            {label}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="lg:col-span-7">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-primary-200 bg-white p-5 shadow-xl shadow-primary-500/10 transition-transform duration-300 hover:-translate-y-0.5 sm:p-8 lg:max-w-none">
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700" aria-hidden="true" />

                    <div className="flex items-center justify-between gap-3">
                        <h3 className="font-archivo text-xl font-bold leading-tight text-neutral-900 sm:text-2xl">{plan.name}</h3>
                        <span className="rounded-full bg-primary-100 px-3 py-1 font-inter text-xs font-semibold text-primary-700">
                            Monthly plan
                        </span>
                    </div>

                    <p className="mt-4 flex items-baseline gap-2">
                        <span className="font-archivo text-4xl font-bold leading-none text-primary-500 sm:text-5xl">
                            {plan.currency}{plan.price.toLocaleString("en-NG")}
                        </span>
                        <span className="font-inter text-sm text-neutral-500 sm:text-base">/{plan.period}</span>
                    </p>

                    <div className="mt-5 border-t border-primary-100 pt-5">
                        <h4 className="font-archivo text-base font-semibold text-neutral-900">Everything included</h4>
                        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                            {plan.benefits.map((benefit) => (
                                <li key={benefit} className="flex items-start gap-3 font-inter text-sm leading-snug text-neutral-600 sm:text-base">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500" aria-hidden="true">
                                        <FiCheck className="h-3 w-3" strokeWidth={3} />
                                    </span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <SignUpButton className="mt-6 h-12 w-full">
                        {plan.cta}
                    </SignUpButton>
                </div>
            </div>
        </Section>
    )
}

export default FlexiblePlan
