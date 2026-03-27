'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    imageUrl: string | null;
    verificationCount: number;
    blockchainStatus: string;
    blockchainHash?: string;
    createdAt: string;
}

interface Verification {
    id: string;
    timestamp: string;
    status: string;
    blockchainTx?: string;
}

export function ProductVerificationContent({ productId }: { productId: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`/api/public/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data.product);
                setVerifications(data.verifications || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified':
                return <CheckCircle2 className="w-6 h-6 text-green-600" />;
            case 'pending':
                return <Clock className="w-6 h-6 text-yellow-600" />;
            default:
                return <AlertCircle className="w-6 h-6 text-red-600" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Verifying product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950">
                    <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h1 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">Product Not Found</h1>
                            <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                                {error || 'This product could not be verified. It may have been deactivated or removed.'}
                            </p>
                            <Link href="/" className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 text-sm font-medium">
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    const isVerified = product.status === 'verified';
    const isPending = product.status === 'pending';
    const isRejected = product.status === 'rejected';
    const hasBlockchainConfirmation = product.blockchainStatus === 'confirmed';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Verify Product Authenticity
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Powered by Patrimoine Heritage Platform
                    </p>
                </div>

                {/* Verification Status - Dynamic based on approval status */}
                {isVerified && (
                    <Card className="mb-6 p-6 border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-xl font-bold text-green-900 dark:text-green-200 mb-1">
                                    Authenticity Verified
                                </h2>
                                <p className="text-sm text-green-800 dark:text-green-300">
                                    This product has been verified and approved by our admin team as an authentic heritage craft.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {isPending && (
                    <Card className="mb-6 p-6 border-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950">
                        <div className="flex items-start gap-4">
                            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-1">
                                    Verification Pending
                                </h2>
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    This product is currently under review by our admin team. Verification will be completed shortly.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {isRejected && (
                    <Card className="mb-6 p-6 border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-xl font-bold text-red-900 dark:text-red-200 mb-1">
                                    Verification Failed
                                </h2>
                                <p className="text-sm text-red-800 dark:text-red-300">
                                    This product could not be verified. Please contact the artisan for details.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Product Details */}
                <Card className="mb-6 p-6 border border-slate-200 dark:border-slate-700">
                    {/* Product Image */}
                    {product.imageUrl && (
                        <div className="mb-6">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    {/* Product Info */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {product.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Category: {product.category}
                            </p>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300">
                            {product.description}
                        </p>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 pt-4">
                            {isVerified && (
                                <Badge className="bg-green-600 hover:bg-green-700 text-white">
                                    ✓ Verified
                                </Badge>
                            )}
                            {isPending && (
                                <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                    ⏳ Pending Review
                                </Badge>
                            )}
                            {isRejected && (
                                <Badge className="bg-red-600 hover:bg-red-700 text-white">
                                    ✗ Rejected
                                </Badge>
                            )}
                            {hasBlockchainConfirmation && (
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                                    ⛓ Blockchain Confirmed
                                </Badge>
                            )}
                        </div>

                        {/* Registration Date */}
                        <div className="pt-4 border-t border-slate-200 dark:border-border">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Registered on Patrimoine Platform
                            </p>
                            <p className="text-slate-900 dark:text-white font-medium">
                                {format(new Date(product.createdAt), 'PPP')}
                            </p>
                        </div>

                        {/* Verification Count */}
                        <div className="bg-slate-100 dark:bg-muted rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Times Verified
                            </p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                {product.verificationCount}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                                Scan count helps establish product history and authenticity
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Recent Verifications */}
                {verifications.length > 0 && (
                    <Card className="mb-6 p-6 border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                            Recent Verification Scans
                        </h4>
                        <div className="space-y-3">
                            {verifications.slice(0, 5).map((verification) => (
                                <div
                                    key={verification.id}
                                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-muted rounded"
                                >
                                    {getStatusIcon(verification.status)}
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                                            {format(new Date(verification.timestamp), 'PPp')}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 capitalize mt-1">
                                            Status: {verification.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {verifications.length > 5 && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 pt-2">
                                    +{verifications.length - 5} more scans
                                </p>
                            )}
                        </div>
                    </Card>
                )}

                {/* Blockchain Info */}
                {product.blockchainHash && (
                    <Card className="mb-6 p-6 border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                            Blockchain Verification
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                                <p className="text-slate-900 dark:text-white font-medium mt-1">
                                    {hasBlockchainConfirmation ? 'Confirmed on Blockchain' : 'Pending Confirmation'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Transaction Hash</p>
                                <code className="block text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-muted p-2 rounded mt-2 break-all font-mono">
                                    {product.blockchainHash}
                                </code>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 pt-2">
                                Blockchain verification provides immutable proof of authenticity stored on a decentralized ledger.
                            </p>
                        </div>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>
                        For more information about this artisan or product, visit{' '}
                        <Link href="/" className="text-primary hover:text-primary/80 font-medium">
                            Patrimoine Heritage Platform
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
