import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../validation/schemas';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import { FaUser, FaUserMd } from "react-icons/fa";

import AuthLayout from '../components/AuthLayout';

function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            console.log('Login:', { ...data, role });
            // Redirect based on selected role
            if (role === 'doctor') {
                navigate('/doctor');
            } else {
                navigate('/patient');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h2 className="font-archivo text-3xl font-bold text-neutral-900 mb-2">
                    Welcome Back
                </h2>
                <p className="font-inter text-base text-neutral-600">
                    Sign in to access your account
                </p>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Role Selector */}
                <div className="flex p-1 bg-neutral-100 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg font-poppins text-sm font-semibold transition-all ${role === 'patient'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                    >
                        <FaUser className="w-3.5 h-3.5" />
                        <span>Patient</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg font-poppins text-sm font-semibold transition-all ${role === 'doctor'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                    >
                        <FaUserMd className="w-4 h-4" />
                        <span>Doctor</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Input */}
                    <FormInput
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    {/* Password Input */}
                    <PasswordInput
                        label="Password"
                        id="password"
                        placeholder="Enter your password"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('rememberMe')}
                                className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
                            />
                            <span className="ml-2 font-inter text-sm text-neutral-700">
                                Remember me '
                                '
                            </span>
                        </label>
                        <Link
                            to="/auth/forgot-password"
                            className="font-inter text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-inter text-base font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:active:scale-100"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white font-inter text-neutral-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg font-inter text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg font-inter text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="mt-6 text-center font-inter text-sm text-neutral-600">
                    Don't have an account?{' '}
                    <Link
                        to="/auth/signup"
                        className="font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

export default LoginPage;
