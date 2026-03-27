'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface WelcomeHeaderProps {
    user?: {
        fullName: string;
        email: string;
    };
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
    if (!user) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        );
    }

    return (
        <div className="pb-4">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                        Welcome back
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {user.fullName} • {user.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
