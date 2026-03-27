import { Metadata } from 'next';
import { SidebarLayout } from '@/components/layouts';
import { ArtisanSidebar } from '@/components/artisan/sidebar/artisan-sidebar';
import { ProductDetailContent } from '@/components/artisan/products/product-detail-content';
import { OnboardingGuard } from '@/components/artisan/onboarding-guard';

export const metadata: Metadata = {
    title: 'Product Details | Patrimoine',
    description: 'Manage and track your product details and verifications',
};

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;

    return (
        <OnboardingGuard>
            <SidebarLayout sidebar={<ArtisanSidebar />}>
                <ProductDetailContent productId={id} />
            </SidebarLayout>
        </OnboardingGuard>
    );
}
