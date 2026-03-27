'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { resendEmailVerification } from '@/app/actions/auth';

interface EmailVerificationProps {
    email: string;
    onVerified: () => void;
}

export function EmailVerification({ email, onVerified }: EmailVerificationProps) {
    const [verified, setVerified] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState<string>('');

    const handleVerified = () => {
        setVerified(true);
        setTimeout(() => onVerified(), 500);
    };

    const handleResend = async () => {
        setIsResending(true);
        setError('');
        try {
            const result = await resendEmailVerification(email);
            if (result.success) {
                setCooldown(30);
                const timer = setInterval(() => {
                    setCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setError(result.error || 'Failed to resend email');
            }
        } catch (err) {
            setError('An error occurred while resending the email');
        } finally {
            setIsResending(false);
        }
    };

    if (verified) {
        return (
            <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Email Verified</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Your email has been verified
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Info */}
            <div className="space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-300">Check your email</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    A verification link has been sent to <span className="font-medium">{email}</span>. Click it within 24 hours to verify your account.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded text-xs text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={handleVerified}
                    className="flex-1 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded text-sm transition-colors"
                >
                    Verified
                </button>

                <button
                    onClick={handleResend}
                    disabled={isResending || cooldown > 0}
                    className="flex-1 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-slate-100 font-medium rounded text-sm transition-colors"
                >
                    {cooldown > 0 ? `${cooldown}s` : 'Resend'}
                </button>
            </div>
        </div>
    );
}
