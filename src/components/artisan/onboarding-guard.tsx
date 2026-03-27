'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Component that checks if user has completed onboarding and been approved
 * - Redirects to onboarding if not completed
 * - Redirects to waiting-approval if pending admin review
 * - Only allows access if approved
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Don't check on onboarding or waiting-approval pages
        if (pathname === '/artisan/onboarding' || pathname === '/artisan/waiting-approval') {
            return;
        }

        // Check if onboarding is completed and approved
        const checkOnboarding = async () => {
            try {
                const response = await fetch('/api/artisan/profile');
                const data = await response.json();

                // Not onboarded yet - redirect to onboarding
                if (data.onboardingCompleted === false) {
                    router.push('/artisan/onboarding');
                    return;
                }

                // Onboarded but pending approval - redirect to waiting page
                if (data.artisanStatus === 'pending') {
                    router.push('/artisan/waiting-approval');
                    return;
                }

                // Rejected by admin - redirect to waiting page
                if (data.artisanStatus === 'rejected') {
                    router.push('/artisan/waiting-approval');
                    return;
                }

                // All good - user is approved, allow access
            } catch (error) {
                console.error('Failed to check onboarding status:', error);
            }
        };

        checkOnboarding();
    }, [pathname, router]);

    return <>{children}</>;
}
