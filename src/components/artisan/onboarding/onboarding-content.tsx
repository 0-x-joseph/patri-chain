'use client';

import { useState, useEffect } from 'react';
import { Step1PersonalInfo } from './step-1-personal';
import { Step2Professional } from './step-2-professional';
import { Step3Portfolio } from './step-3-portfolio';
import { Step4Documents } from './step-4-documents';
import { CheckCircle2 } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 'complete';

interface OnboardingData {
    // Step 1
    profilePhoto?: File;
    dateOfBirth?: string;
    gender?: string;

    // Step 2
    artisanLicense?: string;
    craftCategory?: string;
    yearsExperience?: number;
    workshopLocation?: string;

    // Step 3
    bio?: string;
    portfolioPhotos?: File[];
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        website?: string;
    };

    // Step 4
    governmentId?: File;
    artisanCard?: File;
    workshopPhoto?: File;
}

export function OnboardingContent() {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [data, setData] = useState<OnboardingData>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-save to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('onboardingDraft', JSON.stringify(data));
        }, 500);
        return () => clearTimeout(timer);
    }, [data]);

    // Load from localStorage on mount
    useEffect(() => {
        const draft = localStorage.getItem('onboardingDraft');
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                setData(parsed);
            } catch (e) {
                console.error('Failed to load draft');
            }
        }
    }, []);

    const handleStepChange = (stepData: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...stepData }));
    };

    const handleNext = () => {
        if (typeof currentStep === 'number' && currentStep < 4) {
            setCurrentStep((currentStep + 1) as Step);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevious = () => {
        if (typeof currentStep === 'number' && currentStep > 1) {
            setCurrentStep((currentStep - 1) as Step);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Add basic fields
            formData.append('dateOfBirth', data.dateOfBirth || '');
            formData.append('gender', data.gender || '');
            formData.append('artisanLicense', data.artisanLicense || '');
            formData.append('craftCategory', data.craftCategory || '');
            formData.append('yearsExperience', String(data.yearsExperience || 0));
            formData.append('workshopLocation', data.workshopLocation || '');
            formData.append('bio', data.bio || '');
            formData.append('socialLinks', JSON.stringify(data.socialLinks || {}));

            // Add files
            if (data.profilePhoto) formData.append('profilePhoto', data.profilePhoto);
            if (data.portfolioPhotos) {
                data.portfolioPhotos.forEach((file, idx) => {
                    formData.append(`portfolioPhoto${idx}`, file);
                });
            }
            if (data.governmentId) formData.append('governmentId', data.governmentId);
            if (data.artisanCard) formData.append('artisanCard', data.artisanCard);
            if (data.workshopPhoto) formData.append('workshopPhoto', data.workshopPhoto);

            const response = await fetch('/api/artisan/onboarding', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit onboarding');
            }

            // Clear draft on success
            localStorage.removeItem('onboardingDraft');
            setCurrentStep('complete');
        } catch (error) {
            console.error('Submission error:', error);
            alert(error instanceof Error ? error.message : 'Failed to submit onboarding');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (currentStep === 'complete') {
        return (
            <div className="max-w-2xl mx-auto px-6 py-12">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                            Application Submitted
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Your profile is now under review. We'll notify you once the admin approves your application.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`h-1 flex-1 rounded-full transition-colors ${step <= currentStep
                                    ? 'bg-primary'
                                    : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Step {currentStep} of 4
                </p>
            </div>

            {/* Steps */}
            {currentStep === 1 && (
                <Step1PersonalInfo
                    data={data}
                    onChange={handleStepChange}
                />
            )}

            {currentStep === 2 && (
                <Step2Professional
                    data={data}
                    onChange={handleStepChange}
                />
            )}

            {currentStep === 3 && (
                <Step3Portfolio
                    data={data}
                    onChange={handleStepChange}
                />
            )}

            {currentStep === 4 && (
                <Step4Documents
                    data={data}
                    onChange={handleStepChange}
                />
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                    ← Previous
                </button>

                {typeof currentStep === 'number' && currentStep < 4 ? (
                    <button
                        onClick={handleNext}
                        className="ml-auto px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded transition-colors text-sm"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="ml-auto px-4 py-2 bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                )}
            </div>
        </div>
    );
}
