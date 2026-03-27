'use client';

import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/artisan/theme-toggle';

export function ThemeToggleWrapper() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-10 w-24" />;
    }

    return <ThemeToggle />;
}
