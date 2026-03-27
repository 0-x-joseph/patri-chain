'use client';

import { useState } from 'react';
import {
    RegistrationForm,
    type VerificationStep,
    type RegistrationFormData,
} from '@/components/auth';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function RegisterPageContent() {
    const [step, setStep] = useState<VerificationStep>('form');
    const [formData, setFormData] = useState<RegistrationFormData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const handleFormDataChange = (data: RegistrationFormData) => {
        setFormData(data);
    };

    const handleFormSuccess = (id: string) => {
        setUserId(id);
        setStep('complete');
    };

    const getStepTitle = (currentStep: VerificationStep): string => {
        switch (currentStep) {
            case 'form':
                return 'Create Your Account';
            case 'email':
                return 'Verify Your Email';
            case 'phone':
                return 'Verify Your Phone';
            case 'complete':
                return 'All Set';
            default:
                return '';
        }
    };

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
                    {/* Header Section */}
                    <div className="px-8 py-6 border-b border-slate-200 dark:border-border bg-slate-50 dark:bg-muted/50">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">
                            {getStepTitle(step)}
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {step === 'form' && 'Create your artisan account'}
                            {step === 'email' && 'Verify your email address'}
                            {step === 'phone' && 'Verify your phone number'}
                            {step === 'complete' && 'Ready to get started'}
                        </p>
                        {/* Progress Bar */}
                        <div className="flex gap-1.5 mt-4">
                            {(['form', 'email', 'phone', 'complete'] as const).map((s, idx) => (
                                <div
                                    key={s}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${(['form', 'email', 'phone', 'complete'].indexOf(step) >= idx) ? 'bg-primary' : 'bg-slate-200 dark:bg-border'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-8">
                        {/* Step 1: Registration Form */}
                        {step === 'form' && (
                            <RegistrationForm
                                onSuccess={handleFormSuccess}
                                onFormDataChange={handleFormDataChange}
                            />
                        )}



                        {/* Step 4: Complete */}
                        {step === 'complete' && (
                            <div className="text-center space-y-4 py-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-2">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-foreground">You're all set!</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Complete your artisan profile to start listing products</p>
                                </div>
                                <Link
                                    href="/artisan/onboarding"
                                    className="inline-block w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-sm transition-colors mt-6"
                                >
                                    Complete Your Profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
