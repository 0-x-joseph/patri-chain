'use client';

import { ReactNode } from 'react';
import { BreadcrumbNav } from '@/components/artisan/breadcrumb-nav';
import { useSidebarState } from '@/contexts/sidebar-context';

interface SidebarLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
}

/**
 * SidebarLayout - Layout with sidebar navigation for authenticated users
 * Used for: artisan dashboard, admin dashboard, settings pages
 */
export function SidebarLayout({ children, sidebar }: SidebarLayoutProps) {
    const { isCollapsed } = useSidebarState();
    const sidebarWidth = isCollapsed ? 'calc(5rem + 1px)' : 'calc(16rem + 1px)'; // +1px for border

    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-950" style={{ marginLeft: sidebarWidth } as React.CSSProperties}>
            {/* Fixed Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen z-40" style={{ width: sidebarWidth } as React.CSSProperties}>
                {sidebar}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Breadcrumb Navigation Header */}
                <header className="bg-white dark:bg-slate-950 px-6 lg:px-8 py-6 flex items-center min-h-[60px]">
                    <BreadcrumbNav />
                </header>

                {/* Content */}
                <main className="flex-1 px-6 lg:px-8 py-6 lg:py-8 bg-white dark:bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
