'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, CheckSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfileDropdown } from '@/components/artisan/user-profile-dropdown';
import { useSidebarState } from '@/contexts/sidebar-context';

export function ArtisanSidebar() {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed } = useSidebarState();

    const menuItems = [
        { label: 'Dashboard', href: '/artisan/dashboard', icon: LayoutDashboard },
        { label: 'Products', href: '/artisan/products', icon: Package },
        { label: 'Verifications', href: '/artisan/verifications', icon: CheckSquare },
        { label: 'Settings', href: '/artisan/settings', icon: Settings },
    ];

    return (
        <nav
            className={`fixed left-0 top-0 h-screen flex flex-col flex-shrink-0 transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-background border-r border-slate-200 dark:border-border`}
        >
            {/* Header with Logo and Toggle */}
            <div className="px-4 py-6 border-b border-slate-200 dark:border-border flex items-center justify-between flex-shrink-0">
                {!isCollapsed && (
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-foreground">
                        PatriChain
                    </h2>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                    title="Toggle sidebar"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    )}
                </button>
            </div>

            {/* Navigation Items - Limited height to prevent scrolling */}
            <div className="flex-1 space-y-1 px-3 py-4 overflow-hidden flex flex-col">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${isActive
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Section with User Profile - Always at bottom, not scrollable */}
            <div className="border-t border-slate-200 dark:border-border p-3 flex-shrink-0">
                {isCollapsed ? (
                    // Avatar only in collapsed state
                    <div className="flex justify-center">
                        <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold hover:bg-primary/90 transition-colors">
                            A
                        </button>
                    </div>
                ) : (
                    // Full profile dropdown in expanded state
                    <UserProfileDropdown />
                )}
            </div>
        </nav>
    );
}
