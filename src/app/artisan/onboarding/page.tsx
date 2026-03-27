import { Metadata } from 'next';
import { OnboardingContent } from '@/components/artisan/onboarding/onboarding-content';

export const metadata: Metadata = {
    title: 'Artisan Onboarding | Patrimoine',
    description: 'Complete your artisan profile for admin verification',
};

export default function ArtisanOnboardingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 py-8">
            <OnboardingContent />
        </div>
    );
}
