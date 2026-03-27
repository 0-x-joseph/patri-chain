import { Metadata } from 'next';
import { SidebarLayout } from '@/components/layouts';
import { ArtisanSidebar } from '@/components/artisan/sidebar/artisan-sidebar';
import { SettingsPageContent } from '@/components/artisan/settings/settings-content';
import { OnboardingGuard } from '@/components/artisan/onboarding-guard';

export const metadata: Metadata = {
    title: 'Settings | Patrimoine',
    description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
    return (
        <OnboardingGuard>
            <SidebarLayout sidebar={<ArtisanSidebar />}>
                <SettingsPageContent />
            </SidebarLayout>
        </OnboardingGuard>
    );
}
