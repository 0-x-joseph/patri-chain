'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ShieldCheck, Eye, Link as LinkIcon } from 'lucide-react';
import { PageHeader } from '@/components/artisan/page-header';
import { format } from 'date-fns';
import Link from 'next/link';

interface AdminProduct {
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    status: string;
    createdAt: string;
    artisanName: string;
    artisanId: string;
    location: string | null;
}

export function AdminProductsContent() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Action State
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const fetchProducts = async (filter = 'all') => {
        setIsLoading(true);
        try {
            const url = filter === 'all' ? '/api/admin/products' : `/api/admin/products?status=${filter}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data.products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(statusFilter);
    }, [statusFilter]);

    const handleUpdateStatus = async (productId: string, newStatus: string) => {
        if (newStatus === 'verified' && !confirm('Are you sure you want to verify this product? This will generate a permanent blockchain record.')) {
            return;
        }

        setIsUpdating(productId);
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Update local state
            setProducts(products.map(p =>
                p.id === productId ? { ...p, status: newStatus } : p
            ));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update');
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Verified</Badge>;
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Pending Review</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    title="Manage Products"
                    description="Review product submissions and manage authenticity verifications."
                />

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {['all', 'pending', 'verified', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${statusFilter === status
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-medium w-64">Product Info</th>
                                <th className="px-6 py-4 font-medium">Artisan Details</th>
                                <th className="px-6 py-4 font-medium">Submitted</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                            Loading products...
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No products found {statusFilter !== 'all' && `with status '${statusFilter}'`}.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded object-cover border border-slate-200 dark:border-slate-700" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                        No img
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-white line-clamp-1">{product.name}</div>
                                                    <div className="text-xs text-slate-500 line-clamp-1">{product.description || 'No description'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900 dark:text-slate-200 font-medium">{product.artisanName}</div>
                                            <div className="text-slate-500 text-xs">{product.location || 'Unknown Location'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {format(new Date(product.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(product.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/product/verify/${product.id}`} target="_blank">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="View Public Page">
                                                        <LinkIcon className="w-4 h-4" />
                                                    </Button>
                                                </Link>

                                                {product.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => handleUpdateStatus(product.id, 'verified')}
                                                            disabled={isUpdating === product.id}
                                                        >
                                                            <ShieldCheck className="w-4 h-4 mr-1" /> Verify
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                                            onClick={() => handleUpdateStatus(product.id, 'rejected')}
                                                            disabled={isUpdating === product.id}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" /> Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {product.status === 'verified' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-amber-600 border-amber-200 hover:bg-amber-50"
                                                        onClick={() => handleUpdateStatus(product.id, 'pending')}
                                                        disabled={isUpdating === product.id}
                                                    >
                                                        Revoke
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}