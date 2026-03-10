import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
});

// Sign up validation schema
export const signUpSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    role: z.enum(['patient', 'doctor'], {
        message: 'Please select a role',
    }),
    specialization: z.string().optional(),
    licenseNumber: z.string().optional(),
    experience: z.string().optional(),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
    agreeToTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: 'You must agree to the terms and conditions',
        }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
}).superRefine((data, ctx) => {
    if (data.role === 'doctor') {
        if (!data.specialization || data.specialization.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Specialization is required for doctors',
                path: ['specialization'],
            });
        }
        if (!data.licenseNumber || data.licenseNumber.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Medical license number is required',
                path: ['licenseNumber'],
            });
        }
        if (!data.experience || data.experience.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Years of experience is required',
                path: ['experience'],
            });
        }
    }
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;


