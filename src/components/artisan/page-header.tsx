'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Array<{
        label: string;
        href: string;
    }>;
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
    return (
        <div className="border-b border-slate-200 dark:border-border bg-white dark:bg-background px-6 lg:px-8 py-4">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1 text-sm mb-3">
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={crumb.href} className="flex items-center gap-1">
                            <Link
                                href={crumb.href}
                                className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                            >
                                {crumb.label}
                            </Link>
                            {idx < breadcrumbs.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Title & Description */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
