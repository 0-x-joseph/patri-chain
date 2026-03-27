'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormData } from '@/lib/validation/registration';
import { registerUser } from '@/app/actions/auth';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { Loader2 } from 'lucide-react';

export function RegistrationForm({
    onSuccess,
    onFormDataChange,
}: {
    onSuccess?: (userId: string) => void;
    onFormDataChange?: (data: RegistrationFormData) => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: 'onBlur',
    });

    const password = watch('password');

    const onSubmit = async (data: RegistrationFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Store form data in parent component
            onFormDataChange?.(data);

            // Call server action to register user
            const result = await registerUser(data);

            if (!result.success) {
                setSubmitError(result.error || 'Registration failed');
                return;
            }

            // Call success callback with userId
            if (result.userId) {
                onSuccess?.(result.userId);
            }
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded text-sm text-red-700 dark:text-red-400">
                    {submitError}
                </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm text-slate-700 dark:text-slate-300">
                    Full Name
                </label>
                <input
                    id="fullName"
                    placeholder="Ahmed Ben Ali"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    {...register('fullName')}
                    aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm text-slate-700 dark:text-slate-300">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                />
                {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
                <label htmlFor="phoneNumber" className="text-sm text-slate-700 dark:text-slate-300">
                    Moroccan Phone Number
                </label>
                <input
                    id="phoneNumber"
                    placeholder="+212612345678"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    {...register('phoneNumber')}
                    aria-invalid={!!errors.phoneNumber}
                />
                {errors.phoneNumber ? (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
                ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">+212612345678 or 0612345678</p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm text-slate-700 dark:text-slate-300">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                />
                {password && <PasswordStrengthIndicator password={password} />}
                {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm text-slate-700 dark:text-slate-300">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    {...register('confirmPassword')}
                    aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 mt-6 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded text-sm transition-colors flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                    </>
                ) : (
                    'Continue'
                )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-xs text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <a href="/sign-in" className="text-primary hover:underline font-medium">
                    Sign in
                </a>
            </p>
        </form>
    );
}
