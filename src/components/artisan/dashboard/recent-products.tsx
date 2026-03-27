'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface Product {
    id: string;
    name: string;
    imageUrl: string | null;
    status: string;
    verificationCount: number;
    blockchainStatus: string;
}

interface RecentProductsProps {
    products: Product[] | null | undefined;
}

export function RecentProducts({ products }: RecentProductsProps) {
    if (products === null) {
        return (
            <div className="border border-slate-200 dark:border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-6">
                    Recent Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="border border-slate-200 dark:border-border rounded-lg overflow-hidden">
                            <Skeleton className="h-40 w-full" />
                            <div className="p-4 space-y-4">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-6">
                Recent Products
            </h2>

            {!products || products.length === 0 ? (
                <p className="text-center text-slate-600 dark:text-slate-400 py-12">
                    No products yet. Add your first product to get started.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="border border-slate-200 dark:border-border rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                        >
                            {product.imageUrl ? (
                                <div className="h-40 bg-slate-200 dark:bg-muted overflow-hidden">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-40 bg-slate-100 dark:bg-muted flex items-center justify-center">
                                    <span className="text-sm text-slate-400">No image</span>
                                </div>
                            )}

                            <div className="p-4">
                                <h3 className="font-semibold text-slate-900 dark:text-foreground mb-3 line-clamp-2">
                                    {product.name}
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                                            Verifications
                                        </span>
                                        <span className="font-bold text-slate-900 dark:text-foreground">
                                            {product.verificationCount}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded border transition-colors ${product.status === 'verified'
                                                    ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                                                    : product.status === 'pending'
                                                        ? 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                                                        : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                                                }`}
                                        >
                                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                        </span>

                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded border transition-colors ${product.blockchainStatus === 'confirmed'
                                                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                                                    : 'bg-slate-100 dark:bg-muted border-slate-300 dark:border-border text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            {product.blockchainStatus.charAt(0).toUpperCase() +
                                                product.blockchainStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
