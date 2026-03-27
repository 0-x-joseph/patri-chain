import { Metadata } from 'next';
import { SidebarLayout } from '@/components/layouts';
import { ArtisanSidebar } from '@/components/artisan/sidebar/artisan-sidebar';
import { ProductListContent } from '@/components/artisan/products/product-list-content';
import { OnboardingGuard } from '@/components/artisan/onboarding-guard';

export const metadata: Metadata = {
    title: 'Products | Patrimoine',
    description: 'Manage your products and track verifications',
};

export default function ProductsPage() {
    return (
        <OnboardingGuard>
            <SidebarLayout sidebar={<ArtisanSidebar />}>
                <ProductListContent />
            </SidebarLayout>
        </OnboardingGuard>
    );
}
