import { Check } from 'lucide-react';

export type VerificationStep = 'form' | 'email' | 'phone' | 'complete';

interface VerificationProgressProps {
    currentStep: VerificationStep;
}

export function VerificationProgress({ currentStep }: VerificationProgressProps) {
    const steps: { key: VerificationStep; label: string; number: number }[] = [
        { key: 'form', label: 'Account Info', number: 1 },
        { key: 'email', label: 'Email Verify', number: 2 },
        { key: 'phone', label: 'Phone Verify', number: 3 },
        { key: 'complete', label: 'Complete', number: 4 },
    ];

    const getStepIndex = (step: VerificationStep) => {
        return steps.findIndex(s => s.key === step);
    };

    const currentIndex = getStepIndex(currentStep);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.key} className="flex items-center flex-1">
                            {/* Circle */}
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${isCompleted
                                        ? 'bg-primary text-primary-foreground'
                                        : isCurrent
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    step.number
                                )}
                            </div>

                            {/* Label */}
                            <div className="ml-3">
                                <p
                                    className={`text-xs font-medium transition-colors ${isCurrent
                                            ? 'text-primary'
                                            : isCompleted
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        }`}
                                >
                                    {step.label}
                                </p>
                            </div>

                            {/* Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 ml-3 transition-colors ${isCompleted ? 'bg-primary' : 'bg-muted'
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
