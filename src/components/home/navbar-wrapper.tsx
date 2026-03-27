'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const NavbarComponent = dynamic(() => import('./navbar').then(mod => ({ default: mod.Navbar })), {
    ssr: false,
    loading: () => (
        <div className="h-16 border-b border-border bg-background/95" />
    ),
});

export function NavbarWrapper() {
    return (
        <Suspense fallback={<div className="h-16 border-b border-border bg-background/95" />}>
            <NavbarComponent />
        </Suspense>
    );
}
