import { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "@assets/logo.png";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { useAdminLogin } from "@/features/admin/hooks/useAdmin";

interface AdminLoginForm {
    email: string;
    password: string;
}

function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: adminLogin, isPending, error } = useAdminLogin();

    const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginForm>();

    const onSubmit = (data: AdminLoginForm) => {
        adminLogin(data);
    };

    const errorMessage = (() => {
        if (!error) return null;
        const status = (error as any)?.response?.status;
        if (status === 401) return "Invalid email or password.";
        if (status === 403) return "Access denied. This portal is for administrators only.";
        return "Something went wrong. Please try again.";
    })();

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Branding */}
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

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    {/* API error banner */}
                    {errorMessage && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                            <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-poppins text-red-700">{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold font-poppins text-neutral-700 flex items-center">
                                <FiMail className="mr-2 text-neutral-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="admin@drmalik.com"
                                {...register("email", { required: "Email is required" })}
                                className={`w-full border rounded-lg px-4 py-3 text-sm font-poppins text-neutral-900 placeholder:text-neutral-400 outline-none transition-all ${
                                    errors.email
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-neutral-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-xs font-poppins text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold font-poppins text-neutral-700 flex items-center">
                                <FiLock className="mr-2 text-neutral-400" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register("password", { required: "Password is required" })}
                                    className={`w-full border rounded-lg px-4 py-3 pr-11 text-sm font-poppins text-neutral-900 placeholder:text-neutral-400 outline-none transition-all ${
                                        errors.password
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-neutral-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs font-poppins text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-poppins font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 disabled:active:scale-100 flex items-center justify-center mt-2"
                        >
                            {isPending ? (
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
