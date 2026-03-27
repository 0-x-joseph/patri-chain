import { Metadata } from 'next';
import { SidebarLayout } from '@/components/layouts';
import { DashboardContent } from '@/components/artisan/dashboard/dashboard-content';
import { ArtisanSidebar } from '@/components/artisan/sidebar/artisan-sidebar';
import { OnboardingGuard } from '@/components/artisan/onboarding-guard';

export const metadata: Metadata = {
    title: 'Artisan Dashboard | Patrimoine',
    description: 'Manage your products and verify artisan heritage crafts',
};

export default function ArtisanDashboardPage() {
    return (
        <OnboardingGuard>
            <SidebarLayout sidebar={<ArtisanSidebar />}>
                <DashboardContent />
            </SidebarLayout>
        </OnboardingGuard>
    );
}
