import { FiDollarSign } from "react-icons/fi";

function DoctorEarnings() {
    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Earnings & Payouts</h1>
                <p className="text-neutral-600 font-poppins text-sm">Track your income, consultations, and payout history.</p>
            </div>

            {/* Coming Soon */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <FiDollarSign className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-lg font-archivo font-bold text-neutral-800 mb-2">Earnings Coming Soon</h2>
                <p className="text-sm font-poppins text-neutral-500 max-w-sm">
                    Earnings tracking and payout management will be available once the payments feature is live.
                </p>
            </div>
        </div>
    );
}

export default DoctorEarnings;
