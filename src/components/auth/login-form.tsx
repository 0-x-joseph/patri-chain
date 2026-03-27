'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
    onSuccess,
}: {
    onSuccess?: (userId: string) => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const [submitError, setSubmitError] = useState<string>('');

    const onSubmit = async (data: LoginFormData) => {
        setSubmitError('');
        try {
            const result = await loginUser(data.email, data.password);
            if (!result.success) {
                setSubmitError(result.error || 'Login failed');
                return;
            }

            if (result.userId) {
                onSuccess?.(result.userId);
            }
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded text-sm text-red-700 dark:text-red-400">
                    {submitError}
                </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm text-slate-700 dark:text-slate-300">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                />
                {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                />
                {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
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
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <a href="/register" className="text-primary hover:underline font-medium">
                    Create one
                </a>
            </p>
        </form>
    );
}
