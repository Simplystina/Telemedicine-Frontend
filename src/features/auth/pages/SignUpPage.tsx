import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FiMail } from 'react-icons/fi';
import { signUpSchema, type SignUpFormData, type SignUpFormInput } from '../validation/schemas';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import SpecialtySelect from '../components/SpecialtyMultiSelect';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthButton from '../components/AuthButton';
import { AuthAlert } from '../components/AuthStatus';

function SignUpPage() {
    const { registerPatient, registerDoctor, isRegisteringPatient, isRegisteringDoctor, registerPatientError, registerDoctorError } = useAuth();

    const isRegistering = isRegisteringPatient || isRegisteringDoctor;
    const registerError = (registerPatientError || registerDoctorError) as any;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SignUpFormInput, unknown, SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            role: 'patient',
            hospital: '',
            licenseNo: '',
            yearsOfPractice: undefined,
            specialtyId: undefined,
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
        },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: SignUpFormData) => {
        try {
            if (data.role === 'doctor') {
                await registerDoctor({
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    hospital: data.hospital,
                    licenseNo: data.licenseNo,
                    yearsOfPractice: data.yearsOfPractice,
                    specialtyId: data.specialtyId,
                });
            } else {
                await registerPatient({
                    email: data.email,
                    password: data.password,
                });
            }
        } catch {
            // Error displayed via registerError banner
        }
    };

    return (
        <AuthLayout>
            <AuthHeader
                title={selectedRole === 'doctor' ? 'Register as a doctor' : 'Create your account'}
                subtitle={
                    selectedRole === 'doctor'
                        ? 'Join our network of healthcare professionals.'
                        : "You're a few moments away from seeing a doctor."
                }
            />

            {registerError && (
                <div>
                    <AuthAlert>
                        {registerError.response?.data?.message || registerError.message || 'Registration failed. Please try again.'}
                    </AuthAlert>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Role selection */}
                <fieldset>
                    <legend className="block font-poppins text-sm font-medium text-neutral-700 mb-1.5">
                        I'm signing up as a
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setValue('role', 'patient')}
                            aria-pressed={selectedRole === 'patient'}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${selectedRole === 'patient'
                                ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-500/10'
                                : 'border-neutral-200 bg-white hover:border-neutral-300'
                                }`}
                        >
                            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${selectedRole === 'patient' ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                                <FaUser className="h-4 w-4" />
                            </span>
                            <span>
                                <span className={`block font-poppins text-sm font-semibold ${selectedRole === 'patient' ? 'text-primary-700' : 'text-neutral-900'}`}>Patient</span>
                                <span className="block font-poppins text-xs text-neutral-500">See a doctor</span>
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setValue('role', 'doctor')}
                            aria-pressed={selectedRole === 'doctor'}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${selectedRole === 'doctor'
                                ? 'border-secondary-500 bg-secondary-500/10 ring-4 ring-secondary-500/10'
                                : 'border-neutral-200 bg-white hover:border-neutral-300'
                                }`}
                        >
                            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${selectedRole === 'doctor' ? 'bg-secondary-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                                <FaUserDoctor className="h-4 w-4" />
                            </span>
                            <span>
                                <span className="block font-poppins text-sm font-semibold text-neutral-900">Doctor</span>
                                <span className="block font-poppins text-xs text-neutral-500">Join the network</span>
                            </span>
                        </button>
                    </div>
                </fieldset>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="First name"
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="e.g. John"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                    />
                    <FormInput
                        label="Last name"
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="e.g. Doe"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                    />
                </div>

                <FormInput
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    icon={<FiMail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                {/* Doctor-only fields */}
                {selectedRole === 'doctor' && (
                    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-100 p-4 animate-fade-in-up">
                        <p className="font-poppins text-xs font-bold text-neutral-500 uppercase tracking-wider">Professional information</p>

                        <FormInput
                            label="Hospital / Clinic"
                            id="hospital"
                            type="text"
                            placeholder="e.g. Lagos General Hospital"
                            error={errors.hospital?.message}
                            {...register('hospital')}
                        />

                        <SpecialtySelect
                            value={watch('specialtyId')}
                            onChange={(id) => setValue('specialtyId', id, { shouldValidate: true })}
                            error={errors.specialtyId?.message}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="License number"
                                id="licenseNo"
                                type="text"
                                placeholder="MDCN-12345"
                                error={errors.licenseNo?.message}
                                {...register('licenseNo')}
                            />
                            <FormInput
                                label="Experience (years)"
                                id="yearsOfPractice"
                                type="number"
                                placeholder="e.g. 5"
                                error={errors.yearsOfPractice?.message}
                                {...register('yearsOfPractice')}
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PasswordInput
                        label="Password"
                        id="password"
                        autoComplete="new-password"
                        placeholder="Create password"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <PasswordInput
                        label="Confirm password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>

                {/* Terms */}
                <div>
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            id="agreeToTerms"
                            {...register('agreeToTerms')}
                            className="w-4 h-4 mt-0.5 rounded accent-primary-500"
                        />
                        <label htmlFor="agreeToTerms" className="ml-2 font-poppins text-sm text-neutral-600">
                            I agree to the{' '}
                            <Link to="/terms" className="text-neutral-900 font-semibold hover:text-primary-600">
                                Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-neutral-900 font-semibold hover:text-primary-600">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                    {errors.agreeToTerms && (
                        <p className="mt-1.5 text-sm text-red-600 font-inter">{errors.agreeToTerms.message}</p>
                    )}
                </div>

                <AuthButton isLoading={isRegistering} loadingText={selectedRole === 'doctor' ? 'Registering...' : 'Creating account...'}>
                    {selectedRole === 'doctor' ? 'Register' : 'Create account'}
                </AuthButton>
            </form>

            <p className="text-center font-poppins text-sm text-neutral-500">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}

export default SignUpPage;
