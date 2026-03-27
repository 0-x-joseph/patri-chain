import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface SidebarLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
    title?: string;
}

/**
 * SidebarLayout - Layout with sidebar navigation for authenticated users
 * Used for: artisan dashboard, admin dashboard, settings pages
 */
export function SidebarLayout({ children, sidebar, title }: SidebarLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-muted/50">
                {sidebar}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                {title && (
                    <header className="border-b border-border bg-card px-4 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    </header>
                )}

                {/* Content */}
                <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
