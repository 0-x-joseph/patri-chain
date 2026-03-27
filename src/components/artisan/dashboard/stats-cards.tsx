'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardsProps {
    stats: {
        totalProducts: number;
        totalVerifications: number;
        accountStatus: string;
    } | null | undefined;
}

export function StatsCards({ stats }: StatsCardsProps) {
    if (!stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    const statItems = [
        { label: 'Total Products', value: stats.totalProducts },
        { label: 'Total Verifications', value: stats.totalVerifications },
        { label: 'Account Status', value: 'Active', isStatus: true },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statItems.map((item, i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">
                        {item.label}
                    </p>
                    {item.isStatus ? (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                                {item.value}
                            </p>
                        </div>
                    ) : (
                        <p className="text-3xl font-bold text-slate-900 dark:text-foreground">
                            {item.value}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
