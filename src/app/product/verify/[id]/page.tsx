import { Metadata } from 'next';
import { ProductVerificationContent } from '@/components/public/product-verification-content';

interface ProductVerifyPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductVerifyPageProps): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Verify Product | Patrimoine',
        description: 'Verify the authenticity of this heritage craft product',
    };
}

export default async function ProductVerifyPage({ params }: ProductVerifyPageProps) {
    const { id } = await params;

    return <ProductVerificationContent productId={id} />;
}
