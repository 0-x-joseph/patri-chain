'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface Verification {
    id: string;
    productName: string;
    timestamp: string;
    status: string;
    blockchainTx: string | null;
}

interface VerificationsTimelineProps {
    verifications: Verification[] | null | undefined;
}

export function VerificationsTimeline({ verifications }: VerificationsTimelineProps) {
    // Show skeleton while loading
    if (!verifications) {
        return (
            <div className="border border-slate-200 dark:border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-6">
                    Recent Verifications
                </h2>
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4 pb-4 border-b border-slate-200 dark:border-border last:border-0">
                            <Skeleton className="w-4 h-4 rounded-full flex-shrink-0 mt-1" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-slate-200 dark:border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-6">
                Recent Verifications
            </h2>

            {verifications.length === 0 ? (
                <p className="text-center text-slate-600 dark:text-slate-400 py-12">
                    No verifications yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {verifications.map((verification, index) => (
                        <div
                            key={verification.id}
                            className="flex gap-4 pb-4 last:pb-0 border-b border-slate-200 dark:border-border last:border-0"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                                {index !== verifications.length - 1 && (
                                    <div className="w-0.5 h-12 bg-slate-200 dark:bg-border my-1"></div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-baseline justify-between gap-2">
                                    <h3 className="font-medium text-slate-900 dark:text-foreground">
                                        {verification.productName}
                                    </h3>
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded border flex-shrink-0 transition-colors ${verification.status === 'confirmed'
                                            ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                                            : 'bg-slate-100 dark:bg-muted border-slate-300 dark:border-border text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {verification.status.charAt(0).toUpperCase() +
                                            verification.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    {new Date(verification.timestamp).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                                {verification.blockchainTx && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 break-all font-mono">
                                        {verification.blockchainTx.slice(0, 32)}...
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
