import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

/**
 * PublicLayout - Minimal header/footer layout for public-facing pages
 * Used for: landing page, verification pages, auth pages
 */
export function PublicLayout({ children, title }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-foreground">Patrimoine</h1>
                    {title && <p className="text-sm text-muted-foreground mt-1">{title}</p>}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/50">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-sm text-muted-foreground text-center">
                        © 2024 Patrimoine. Preserving heritage crafts.
                    </p>
                </div>
            </footer>
        </div>
    );
}
