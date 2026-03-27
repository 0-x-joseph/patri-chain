import { Metadata } from 'next';
import { SidebarLayout } from '@/components/layouts';
import { ArtisanSidebar } from '@/components/artisan/sidebar/artisan-sidebar';
import { VerificationsPageContent } from '@/components/artisan/verifications/verifications-content';
import { OnboardingGuard } from '@/components/artisan/onboarding-guard';

export const metadata: Metadata = {
    title: 'Verifications | Patrimoine',
    description: 'Track all product verifications and scan history',
};

export default function VerificationsPage() {
    return (
        <OnboardingGuard>
            <SidebarLayout sidebar={<ArtisanSidebar />}>
                <VerificationsPageContent />
            </SidebarLayout>
        </OnboardingGuard>
    );
}
