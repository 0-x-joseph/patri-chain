'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus, Grid3x3, List, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface Product {
    id: string;
    name: string;
    category: string;
    imageUrl: string | null;
    status: string;
    verificationCount: number;
    blockchainStatus: string;
    createdAt: string;
}

type ViewType = 'grid' | 'table';

export function ProductListContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [viewType, setViewType] = useState<ViewType>('grid');

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const response = await fetch('/api/artisan/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, categoryFilter]);

    const categories = [...new Set(products.map((p) => p.category))];

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    <Button onClick={fetchProducts} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    {isLoading ? (
                        <Skeleton className="h-8 w-48" />
                    ) : (
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                        </h2>
                    )}
                </div>
                <Link
                    href="/artisan/products/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="flex-1 px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
                        <button
                            onClick={() => setViewType('grid')}
                            className={`p-2 rounded transition-colors ${viewType === 'grid'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            title="Grid view"
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewType('table')}
                            className={`p-2 rounded transition-colors ${viewType === 'table'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            title="Table view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products */}
            {isLoading ? (
                viewType === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <Skeleton className="h-40 w-full" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Product</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Category</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Verifications</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                                        <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-900 dark:text-slate-200 font-medium mb-1">No products found</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                        {searchQuery || categoryFilter ? 'Try adjusting your search or filters' : 'Get started by adding your first product'}
                    </p>
                    <Link
                        href="/artisan/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Your First Product
                    </Link>
                </div>
            ) : viewType === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/artisan/products/${product.id}`}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:border-primary dark:hover:border-primary transition-colors"
                        >
                            {product.imageUrl ? (
                                <div className="h-40 bg-slate-200 dark:bg-slate-800">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="text-slate-400">No image</span>
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                    {product.category}
                                </p>
                                <div className="flex gap-2">
                                    <span
                                        className={`text-xs font-medium px-2 py-1 rounded border ${product.status === 'verified'
                                            ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                                            : product.status === 'pending'
                                                ? 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                                                : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                                            }`}
                                    >
                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                    </span>
                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                        {product.verificationCount} scans
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                                    Verifications
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, idx) => (
                                <tr
                                    key={product.id}
                                    className={`border-b border-slate-200 dark:border-slate-700 ${idx % 2 === 0
                                        ? 'bg-white dark:bg-slate-900'
                                        : 'bg-slate-50 dark:bg-slate-800'
                                        }`}
                                >
                                    <td className="px-4 py-3 text-slate-900 dark:text-white">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                        {product.category}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded border ${product.status === 'verified'
                                                ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                                                : product.status === 'pending'
                                                    ? 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                                                    : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                                                }`}
                                        >
                                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                        {product.verificationCount}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/artisan/products/${product.id}`}
                                            className="text-primary hover:text-primary/80 text-sm font-medium"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
