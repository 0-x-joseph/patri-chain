'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-muted transition-colors hover:bg-slate-200 dark:hover:bg-border"
            title="Toggle theme"
        >
            <Sun className="w-4 h-4 text-amber-600 dark:hidden" />
            <Moon className="w-4 h-4 text-slate-400 hidden dark:block" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {theme === 'light' ? 'Light' : 'Dark'}
            </span>
        </button>
    );
}
