import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FaUserDoctor } from "react-icons/fa6"
import { FaUser } from "react-icons/fa"
import { signUpSchema, type SignUpFormData } from '../validation/schemas';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';

import AuthLayout from '../components/AuthLayout';

function SignUpPage() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: '',
            email: '',
            role: 'patient',
            specialization: '',
            licenseNumber: '',
            experience: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
        },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: SignUpFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Sign up:', data);
            // Handle successful signup here
        } catch (error) {
            console.error('Sign up error:', error);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center pt-2 pb-5">
                <h2 className="font-archivo text-3xl font-bold text-neutral-900 mb-2">
                    {selectedRole === 'doctor' ? 'Register as a Doctor' : 'Create Account'}
                </h2>
                <p className="font-poppins text-base text-neutral-600">
                    {selectedRole === 'doctor'
                        ? 'Join our network of healthcare professionals'
                        : 'Join us for quality healthcare'}
                </p>
            </div>

            {/* Sign Up Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Role Selection - Modern Radio Cards */}
                    <div className="space-y-3">
                        <label className="block font-poppins text-sm font-semibold text-neutral-900">
                            Are you signing up as a patient or doctor?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setValue('role', 'patient')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${selectedRole === 'patient'
                                    ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-500/10'
                                    : 'border-neutral-100 bg-neutral-50 hover:border-neutral-200 hover:bg-neutral-100'
                                    }`}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${selectedRole === 'patient' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400'}`}>
                                    <FaUser className='w-8 h-8' />
                                </div>
                                <span className={`font-poppins text-sm font-bold ${selectedRole === 'patient' ? 'text-primary-700' : 'text-neutral-600'}`}>Patient</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue('role', 'doctor')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${selectedRole === 'doctor'
                                    ? 'border-secondary-500 bg-secondary-50 ring-4 ring-secondary-500/10'
                                    : 'border-neutral-100 bg-neutral-50 hover:border-neutral-200 hover:bg-neutral-100'
                                    }`}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${selectedRole === 'doctor' ? 'bg-secondary-500 text-white' : 'bg-white text-neutral-400'}`}>
                                    <FaUserDoctor className='w-8 h-8' />
                                </div>
                                <span className={`font-poppins text-sm font-bold ${selectedRole === 'doctor' ? 'text-secondary-700' : 'text-neutral-600'}`}>Doctor</span>
                            </button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <FormInput
                        label="Full Name"
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                    />

                    <FormInput
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    {/* Conditional Doctor Fields */}
                    {selectedRole === 'doctor' && (
                        <div className="space-y-4 pt-2 border-t border-neutral-100 mt-2 animate-fade-in-up">
                            <p className="font-poppins text-xs font-bold text-neutral-500 uppercase tracking-wider">Professional Information</p>

                            <FormInput
                                label="Specialization"
                                id="specialization"
                                type="text"
                                placeholder="e.g. Cardiologist, General Physician"
                                error={errors.specialization?.message}
                                {...register('specialization')}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="License Number"
                                    id="licenseNumber"
                                    type="text"
                                    placeholder="MDCN-12345"
                                    error={errors.licenseNumber?.message}
                                    {...register('licenseNumber')}
                                />
                                <FormInput
                                    label="Experience (Years)"
                                    id="experience"
                                    type="number"
                                    placeholder="e.g. 5"
                                    error={errors.experience?.message}
                                    {...register('experience')}
                                />
                            </div>
                        </div>
                    )}

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PasswordInput
                            label="Password"
                            id="password"
                            placeholder="Create password"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <PasswordInput
                            label="Confirm"
                            id="confirmPassword"
                            placeholder="Confirm"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />
                    </div>

                    {/* Terms and Conditions */}
                    <div>
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                {...register('agreeToTerms')}
                                className="w-4 h-4 mt-1 text-primary-500 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 font-poppins text-sm text-neutral-700">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary-500 font-poppins hover:text-primary-600 font-semibold">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-primary-500 font-poppins hover:text-primary-600 font-semibold">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="mt-1 text-sm text-red-600 font-poppins">{errors.agreeToTerms.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full font-poppins bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white text-base font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:active:scale-100"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center font-poppins">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {selectedRole === 'doctor' ? 'Registering...' : 'Creating account...'}
                            </span>
                        ) : (
                            selectedRole === 'doctor' ? 'Register' : 'Create Account'
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center font-poppins text-sm text-neutral-600">
                    Already have an account?{' '}
                    <Link
                        to="/auth/login"
                        className="font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

export default SignUpPage;
