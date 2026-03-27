'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export function BreadcrumbNav() {
    const pathname = usePathname();

    // Parse the pathname into segments
    const segments = pathname
        .split('/')
        .filter(Boolean)
        .map((segment) => ({
            name: segment.charAt(0).toUpperCase() + segment.slice(1),
            segment,
        }));

    if (segments.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            {segments.map((item, index) => (
                <div key={item.segment} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span className={`text-sm ${index === segments.length - 1 ? 'font-semibold text-slate-900 dark:text-slate-50' : 'font-medium text-slate-600 dark:text-slate-400'}`}>
                        {item.name}
                    </span>
                </div>
            ))}
        </div>
    );
}
