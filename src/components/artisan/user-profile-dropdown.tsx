'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/actions/auth';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
    fullName: string;
    email: string;
}

export function UserProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/artisan/profile');
                if (response.ok) {
                    const data = await response.json();
                    setUser({
                        fullName: data.fullName,
                        email: data.email,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success('Logged out successfully');
            window.location.href = '/';
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    if (isLoading) {
        return <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
                <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                        {user.fullName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {user.email}
                    </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                            {user.fullName}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <Link
                            href="/artisan/settings"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                        <Link
                            href="/artisan/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-200 dark:border-slate-700 py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
