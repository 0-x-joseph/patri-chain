'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, Settings, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useSidebarState } from '@/contexts/sidebar-context';
// You might create a UserProfileDropdown for Admin, or just reuse a static one for MVP
// import { UserProfileDropdown } from '@/components/admin/user-profile-dropdown';

export function AdminSidebar() {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed } = useSidebarState();

    const menuItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Artisans', href: '/admin/artisans', icon: Users },
        { label: 'Products', href: '/admin/products', icon: Package },
        // Add settings or other features for admin if needed
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav
            className={`fixed left-0 top-0 h-screen flex flex-col flex-shrink-0 transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'} bg-[#1e293b] text-slate-100 border-r border-[#334155]`}
        >
            {/* Header with Logo and Toggle */}
            <div className="px-4 py-6 border-b border-[#334155] flex items-center justify-between flex-shrink-0">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
                            Admin Panel
                        </h2>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-[#334155] rounded-lg transition-colors flex-shrink-0 text-slate-400 hover:text-white"
                    title="Toggle sidebar"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 space-y-1 px-3 py-4 overflow-hidden flex flex-col">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${isActive
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-300 hover:bg-[#334155] hover:text-white'
                                }`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Section */}
            <div className="border-t border-[#334155] p-3 flex-shrink-0">
                {isCollapsed ? (
                    <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            AD
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            AD
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-white truncate">Administrator</span>
                            <span className="text-xs text-slate-400 truncate">admin@patrimoine.ma</span>
                            <button onClick={handleLogout} className="text-left text-xs text-red-400 hover:text-red-300 mt-1 cursor-pointer w-fit">Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}