import { FiDollarSign, FiTrendingUp, FiCreditCard, FiArrowDownRight } from "react-icons/fi";

const monthlyData = [
    { month: "Oct", amount: 380000, consultations: 32 },
    { month: "Nov", amount: 420000, consultations: 36 },
    { month: "Dec", amount: 350000, consultations: 28 },
    { month: "Jan", amount: 470000, consultations: 40 },
    { month: "Feb", amount: 510000, consultations: 44 },
    { month: "Mar", amount: 480000, consultations: 41 },
];

const maxAmount = Math.max(...monthlyData.map(d => d.amount));

const transactions = [
    { id: "t1", patient: "Jane Doe", type: "Consultation", date: "Mar 29, 2026", amount: 15000, status: "paid" },
    { id: "t2", patient: "Emeka Eze", type: "Follow-up", date: "Mar 28, 2026", amount: 10000, status: "paid" },
    { id: "t3", patient: "Aisha Bello", type: "New Consultation", date: "Mar 27, 2026", amount: 20000, status: "pending" },
    { id: "t4", patient: "David Okonkwo", type: "Routine Check", date: "Mar 26, 2026", amount: 10000, status: "paid" },
    { id: "t5", patient: "Chidi Okeke", type: "Cardiology Review", date: "Mar 25, 2026", amount: 25000, status: "paid" },
];

function DoctorEarnings() {
    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Earnings & Payouts</h1>
                <p className="text-neutral-600 font-poppins text-sm">Track your income, consultations, and payout history.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <FiDollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs font-poppins font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                    </div>
                    <p className="text-2xl font-archivo font-bold text-neutral-900">₦480,000</p>
                    <p className="text-xs font-poppins text-neutral-500 mt-1">March 2026 Revenue</p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                            <FiTrendingUp className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-xs font-poppins font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">41 sessions</span>
                    </div>
                    <p className="text-2xl font-archivo font-bold text-neutral-900">₦2,610,000</p>
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Total 2026 Revenue</p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FiCreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <button className="text-xs font-poppins font-semibold text-primary-600 hover:text-primary-700 transition-colors">Request</button>
                    </div>
                    <p className="text-2xl font-archivo font-bold text-neutral-900">₦350,000</p>
                    <p className="text-xs font-poppins text-neutral-500 mt-1">Pending Payout</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    <h2 className="text-lg font-archivo font-bold text-neutral-900 mb-6">Monthly Revenue</h2>
                    <div className="flex items-end justify-between space-x-3 h-40">
                        {monthlyData.map((d) => (
                            <div key={d.month} className="flex-1 flex flex-col items-center space-y-2">
                                <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                                    <div
                                        className="w-full bg-primary-100 rounded-t-lg hover:bg-primary-500 transition-colors cursor-pointer relative group"
                                        style={{ height: `${(d.amount / maxAmount) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-poppins px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ₦{(d.amount / 1000).toFixed(0)}k
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-poppins text-neutral-500">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    <h2 className="text-base font-archivo font-bold text-neutral-900 mb-4">Recent Transactions</h2>
                    <div className="space-y-3">
                        {transactions.map((txn) => (
                            <div key={txn.id} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                                <div>
                                    <p className="text-xs font-bold font-poppins text-neutral-900">{txn.patient}</p>
                                    <p className="text-[10px] font-poppins text-neutral-400">{txn.type} · {txn.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold font-poppins text-green-600">+₦{txn.amount.toLocaleString()}</p>
                                    <span className={`text-[10px] font-bold font-poppins ${txn.status === "paid" ? "text-green-500" : "text-amber-500"}`}>
                                        {txn.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-xl border border-neutral-200 font-poppins text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center justify-center space-x-1">
                        <FiArrowDownRight className="w-4 h-4" />
                        <span>View All Transactions</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoctorEarnings;
