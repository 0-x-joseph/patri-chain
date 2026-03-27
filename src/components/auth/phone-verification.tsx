'use client';

import { useState } from 'react';
import { verifyPhoneCode, resendPhoneVerificationCode } from '@/app/actions/auth';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface PhoneVerificationProps {
    userId: string;
    phoneNumber: string;
    onVerified: () => void;
}

export function PhoneVerification({
    userId,
    phoneNumber,
    onVerified,
}: PhoneVerificationProps) {
    const [code, setCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleVerify = async () => {
        if (!code || code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            const result = await verifyPhoneCode(userId, phoneNumber, code);
            if (!result.success) {
                setError(result.error || 'Verification failed');
                return;
            }

            setSuccess(true);
            setTimeout(onVerified, 500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setError('');

        try {
            const result = await resendPhoneVerificationCode(userId, phoneNumber);
            if (!result.success) {
                setError(result.error || 'Failed to resend SMS');
                return;
            }
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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend SMS');
        } finally {
            setIsResending(false);
        }
    };

    const handleCodeChange = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 6);
        setCode(digits);
    };

    if (success) {
        return (
            <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-foreground">Phone Verified</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Your phone number has been verified
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Info */}
            <div className="space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-300">Enter verification code</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    A 6-digit code was sent to <span className="font-medium">{phoneNumber}</span>
                </p>
            </div>

            {/* Code Input */}
            <div className="space-y-2">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    maxLength={6}
                    className="w-full px-3 py-2 text-center text-2xl tracking-[0.3em] font-mono font-semibold border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Expires in 10 minutes</p>
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
                    onClick={handleVerify}
                    disabled={isVerifying || code.length !== 6}
                    className="flex-1 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Verifying
                        </>
                    ) : (
                        'Verify'
                    )}
                </button>

                <button
                    onClick={handleResend}
                    disabled={isResending || cooldown > 0}
                    className="flex-1 py-2 border border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-foreground font-medium rounded text-sm transition-colors"
                >
                    {cooldown > 0 ? `${cooldown}s` : 'Resend'}
                </button>
            </div>
        </div>
    );
}
