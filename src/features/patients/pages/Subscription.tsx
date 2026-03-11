import { FiCheck, FiShield, FiStar, FiActivity } from "react-icons/fi";

function Subscription() {
    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto pt-4">
                <div className="inline-flex items-center justify-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-poppins font-semibold text-sm mb-6">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span>Premium Healthcare Access</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-archivo font-bold text-neutral-900 mb-4">
                    Unlimited Care, One Simple Price
                </h1>
                <p className="text-neutral-600 font-poppins text-lg">
                    Upgrade to Premium and get unlimited access to our entire network of top-rated specialists, priority booking, and 24/7 support.
                </p>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">

                {/* Basic / Free Tier */}
                <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-bl-full -z-10"></div>
                    <div className="mb-8">
                        <h3 className="text-xl font-archivo font-bold text-neutral-900 mb-2">Basic Access</h3>
                        <p className="text-neutral-500 font-poppins flex items-baseline">
                            <span className="text-4xl font-bold font-archivo text-neutral-900 mr-1">₦0</span>
                            / one-time
                        </p>
                    </div>

                    <ul className="space-y-4 font-poppins text-neutral-600 flex-1">
                        <li className="flex items-start">
                            <FiCheck className="w-5 h-5 text-neutral-400 shrink-0 mr-3 mt-0.5" />
                            <span><strong>1 Free</strong> Consultation</span>
                        </li>
                        <li className="flex items-start">
                            <FiCheck className="w-5 h-5 text-neutral-400 shrink-0 mr-3 mt-0.5" />
                            <span>Basic Health Records</span>
                        </li>
                    </ul>

                    <button className="w-full mt-8 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-poppins font-semibold py-3.5 rounded-xl transition-colors">
                        Current Plan
                    </button>
                </div>

                {/* Premium Tier */}
                <div className="bg-primary-900 rounded-3xl border border-primary-800 p-8 shadow-xl flex flex-col relative overflow-hidden transform md:-translate-y-4">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-800 rounded-bl-full opacity-50"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-800 rounded-full blur-2xl opacity-50"></div>

                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold font-poppins px-3 py-1 rounded-full">
                        MOST POPULAR
                    </div>

                    <div className="mb-8 relative z-10">
                        <h3 className="text-xl font-archivo font-bold text-white mb-2">Premium Unlimited</h3>
                        <p className="text-primary-100 font-poppins flex items-baseline">
                            <span className="text-4xl font-bold font-archivo text-white mr-1">₦5000</span>
                            / month
                        </p>
                    </div>

                    <ul className="space-y-4 font-poppins text-primary-50 flex-1 relative z-10">
                        <li className="flex items-start">
                            <FiCheck className="w-5 h-5 text-primary-400 shrink-0 mr-3 mt-0.5" />
                            <span><strong>Unlimited</strong> Consultations</span>
                        </li>
                        <li className="flex items-start">
                            <FiCheck className="w-5 h-5 text-primary-400 shrink-0 mr-3 mt-0.5" />
                            <span>Priority Booking & Less Wait Time</span>
                        </li>
                        <li className="flex items-start">
                            <FiCheck className="w-5 h-5 text-primary-400 shrink-0 mr-3 mt-0.5" />
                            <span>Full Family Member Add-ons</span>
                        </li>
                        <li className="flex items-start">
                            <FiCheck className="w-5 h-5 text-primary-400 shrink-0 mr-3 mt-0.5" />
                            <span>24/7 Dedicated Support Line</span>
                        </li>
                    </ul>

                    <button className="w-full mt-8 bg-primary-500 hover:bg-primary-400 text-white font-poppins font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-primary-500/25 relative z-10">
                        Subscribe Now
                    </button>
                    <p className="text-center text-primary-300 text-xs font-poppins mt-3 relative z-10">Cancel anytime. No hidden fees.</p>
                </div>

            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-4 mt-12 pt-8 border-t border-neutral-200">
                <div className="flex items-center space-x-3 text-neutral-600 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold font-archivo text-neutral-900 text-sm">HIPAA Compliant</h4>
                        <p className="text-xs font-poppins">Your data is fully secure</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 text-neutral-600 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                        <FiActivity className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold font-archivo text-neutral-900 text-sm">Top 1% Providers</h4>
                        <p className="text-xs font-poppins">Vetted medical professionals</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Subscription;
