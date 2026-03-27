import { Metadata } from 'next';
import { SidebarLayout } from '@/components/layouts';
import { ArtisanSidebar } from '@/components/artisan/sidebar/artisan-sidebar';
import { AddProductContent } from '@/components/artisan/products/add-product-content';
import { OnboardingGuard } from '@/components/artisan/onboarding-guard';

export const metadata: Metadata = {
    title: 'Add Product | Patrimoine',
    description: 'Register a new product with photos and details',
};

export default function AddProductPage() {
    return (
        <OnboardingGuard>
            <SidebarLayout sidebar={<ArtisanSidebar />}>
                <AddProductContent />
            </SidebarLayout>
        </OnboardingGuard>
    );
}
