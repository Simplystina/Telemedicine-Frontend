import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/logo.png";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/admin/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Logo / Branding */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <img src={Logo} alt="logo" className="h-12 w-auto mix-blend-multiply" />
                        <span className="text-lg font-semibold font-archivo text-primary-500">
                            Dr. Malik Telemedicine
                        </span>
                    </div>
                    <h2 className="font-archivo text-3xl font-bold text-neutral-900 mb-2">
                        Admin Portal
                    </h2>
                    <p className="font-poppins text-sm text-neutral-600">
                        Sign in to access the administrative dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold font-poppins text-neutral-700 flex items-center">
                                <FiMail className="mr-2 text-neutral-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@drmalik.com"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm font-poppins text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold font-poppins text-neutral-700 flex items-center">
                                    <FiLock className="mr-2 text-neutral-400" />
                                    Password
                                </label>
                                <button type="button" className="text-xs font-semibold font-poppins text-primary-500 hover:text-primary-600 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm font-poppins text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-poppins font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:active:scale-100 flex items-center justify-center mt-2"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>
                                    Sign In
                                    <FiArrowRight className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 font-poppins text-xs text-neutral-400">
                    Restricted to authorized platform administrators only.
                </p>
            </div>
        </div>
    );
}

export default AdminLoginPage;
