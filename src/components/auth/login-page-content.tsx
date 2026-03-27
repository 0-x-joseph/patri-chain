'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function LoginPageContent() {
    const [isComplete, setIsComplete] = useState(false);

    const handleLoginSuccess = (userId: string) => {
        setIsComplete(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = '/artisan/dashboard';
        }, 1000);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-background">
                <div className="w-full max-w-sm">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
                        >
                            ← Back to home
                        </Link>
                    </div>

                    {/* Main Container */}
                    <div className="border border-slate-200 dark:border-border rounded-lg overflow-hidden shadow-sm">
                        <div className="px-8 py-12 text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-2">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-foreground">Welcome back</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Redirecting to dashboard...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-background">
            <div className="w-full max-w-sm">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
                    >
                        ← Back to home
                    </Link>
                </div>

                {/* Main Container */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                    {/* Header Section */}
                    <div className="px-8 py-6 border-b border-slate-200 dark:border-border bg-slate-50 dark:bg-muted/50">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">
                            Sign in
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-8">
                        <LoginForm onSuccess={handleLoginSuccess} />

                        {/* Sign Up Link */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-border text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-primary hover:text-primary/90 font-medium transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
