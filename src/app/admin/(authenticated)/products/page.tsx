export const metadata = {
    title: 'Manage Products | Admin Dashboard',
    description: 'Review and manage artisan products for authenticity verification.',
};

import { AdminProductsContent } from '@/components/admin/products/admin-products-content';

export default function AdminProductsPage() {
    return <AdminProductsContent />;
}