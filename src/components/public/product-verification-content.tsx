'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Clock, MapPin, BadgeInfo, Link2 } from 'lucide-react';
import Link from 'next/link';

interface ArtisanProfile {
    fullName: string;
    profilePhotoUrl: string | null;
    workshopLocation: string | null;
    craftCategory: string | null;
    bio: string | null;
}

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    imageUrl: string | null;
    verificationCount: number;
    blockchainStatus: string;
    blockchainHash: string | undefined;
    onChainRecord?: {
        exists: boolean;
        productHash: string;
        artisan: string;
        timestamp: number;
    } | null;
    createdAt: string;
    artisanProfile: ArtisanProfile | null;
}

interface Verification {
    id: string;
    timestamp: string;
    status: string;
    blockchainTx?: string;
}

interface RelatedProduct {
    id: string;
    name: string;
    imageUrl: string | null;
}

export function ProductVerificationContent({ productId }: { productId: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifySuccess, setVerifySuccess] = useState(false);

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
                setRelatedProducts(data.relatedProducts || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId]);

    const handleVerifyProduct = async () => {
        if (!product || product.status !== 'verified') {
            setError('Only approved products can be verified.');
            return;
        }
        setIsVerifying(true);
        setVerifySuccess(false);
        try {
            const response = await fetch('/api/public/verifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to verify product');
            }
            const data = await response.json();
            setVerifySuccess(true);
            if (product) {
                setProduct({ ...product, verificationCount: product.verificationCount + 1 });
            }
            const productResponse = await fetch(`/api/public/products/${productId}`);
            if (productResponse.ok) {
                const productData = await productResponse.json();
                setVerifications(productData.verifications || []);
            }
            setTimeout(() => setVerifySuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to verify product');
        } finally {
            setIsVerifying(false);
        }
    };

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-gradient-to-r from-transparent to-green-600 dark:to-green-400"></div>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Heritage Verification</span>
                        <div className="h-1 w-8 bg-gradient-to-l from-transparent to-green-600 dark:to-green-400"></div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                        Verify Product Authenticity
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                        Scan or verify genuine heritage crafts powered by Patrimoine Heritage Platform
                    </p>
                </div>

                {/* Artisan Info */}
                {product.artisanProfile && (
                    <Card className="mb-8 p-8 border border-gradient-to-r from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-slate-900 dark:to-emerald-950 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {product.artisanProfile.profilePhotoUrl ? (
                                <img
                                    src={product.artisanProfile.profilePhotoUrl}
                                    alt={product.artisanProfile.fullName}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-green-400 dark:border-green-500 shadow-md flex-shrink-0"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center flex-shrink-0 border-4 border-green-400 dark:border-green-500">
                                    <BadgeInfo className="w-12 h-12 text-green-600 dark:text-green-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:gap-3 mb-3">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {product.artisanProfile.fullName}
                                    </h3>
                                    {product.artisanProfile.craftCategory && (
                                        <Badge className="w-fit bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1">{product.artisanProfile.craftCategory}</Badge>
                                    )}
                                </div>
                                {product.artisanProfile.workshopLocation && (
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                                        <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        {product.artisanProfile.workshopLocation}
                                    </div>
                                )}
                                {product.artisanProfile.bio && (
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{product.artisanProfile.bio}</p>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <Card className="mb-8 p-8 border border-slate-200 dark:border-slate-700 shadow-md">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Link2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            Related Products from this Region
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                            {relatedProducts.map((rp) => (
                                <Link key={rp.id} href={`/product/verify/${rp.id}`} className="block group">
                                    <div className="aspect-square w-full rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-md group-hover:shadow-lg group-hover:border-green-400 dark:group-hover:border-green-500 transition-all duration-300">
                                        {rp.imageUrl ? (
                                            <img src={rp.imageUrl} alt={rp.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-900">No Image</div>
                                        )}
                                    </div>
                                    <div className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300 text-center truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{rp.name}</div>
                                </Link>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Verification Status - Dynamic based on approval status */}
                {isVerified && (
                    <Card className="mb-8 p-6 border-2 border-green-400 dark:border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full flex-shrink-0">
                                <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-green-900 dark:text-green-200 mb-1">
                                    ✓ Authenticity Verified
                                </h2>
                                <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
                                    This product has been verified and approved by our admin team as an authentic heritage craft. You can confidently support this artisan.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {isPending && (
                    <Card className="mb-8 p-6 border-2 border-amber-400 dark:border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full flex-shrink-0">
                                <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400 animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-1">
                                    ⏳ Verification Pending
                                </h2>
                                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                    This product is currently under review by our admin team. Verification will be completed shortly.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {isRejected && (
                    <Card className="mb-8 p-6 border-2 border-red-400 dark:border-red-500 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full flex-shrink-0">
                                <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-red-900 dark:text-red-200 mb-1">
                                    ✗ Verification Failed
                                </h2>
                                <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
                                    This product could not be verified. Please contact the artisan for details or clarifications.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Product Details */}
                <Card className="mb-8 p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                    {/* Product Image */}
                    {product.imageUrl && (
                        <div className="mb-8 -mx-8 -mt-8">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-80 object-cover rounded-t-lg shadow-md"
                            />
                        </div>
                    )}

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                            {isVerified && (
                                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 font-semibold shadow-md">
                                    ✓ Verified
                                </Badge>
                            )}
                            {isPending && (
                                <Badge className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-4 py-2 font-semibold shadow-md">
                                    ⏳ Pending Review
                                </Badge>
                            )}
                            {isRejected && (
                                <Badge className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 font-semibold shadow-md">
                                    ✗ Rejected
                                </Badge>
                            )}
                            {hasBlockchainConfirmation && (
                                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 font-semibold shadow-md">
                                    ⛓ Blockchain Confirmed
                                </Badge>
                            )}
                        </div>

                        {/* Registration Date */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-6">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Registered Date</p>
                                <p className="text-xl text-slate-900 dark:text-white font-bold mt-2">
                                    {format(new Date(product.createdAt), 'PPP')}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">On Patrimoine Platform</p>
                            </div>
                        </div>

                        {/* Verification Count */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 border border-green-200 dark:border-green-800">
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">
                                Community Verifications
                            </p>
                            <p className="text-5xl font-bold text-green-600 dark:text-green-400 leading-tight mt-2">
                                {product.verificationCount}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                                This product has been verified by community members, establishing its authentic heritage craft status
                            </p>
                        </div>

                        {/* Verify Button */}
                        {isVerified && (
                            <div className="pt-6 space-y-4">
                                <Button
                                    onClick={handleVerifyProduct}
                                    disabled={isVerifying}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                                >
                                    {isVerifying ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                            Verifying...
                                        </>
                                    ) : (
                                        '✓ Verify This Product'
                                    )}
                                </Button>

                                {/* Success Message */}
                                {verifySuccess && (
                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-400 dark:border-green-500 rounded-lg text-center">
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                            ✓ Product verification recorded successfully!
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">Thank you for supporting authentic heritage crafts</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Recent Verifications */}
                {verifications.length > 0 && (
                    <Card className="mb-8 p-8 border border-slate-200 dark:border-slate-700 shadow-md">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            Recent Community Scans
                        </h4>
                        <div className="space-y-3">
                            {verifications.slice(0, 5).map((verification) => (
                                <div
                                    key={verification.id}
                                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 transition-colors"
                                >
                                    {getStatusIcon(verification.status)}
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900 dark:text-white font-semibold">
                                            {format(new Date(verification.timestamp), 'PPp')}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 capitalize mt-1">
                                            Verified ✓
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {verifications.length > 5 && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 pt-3 pl-2 font-medium">
                                    + {verifications.length - 5} more community verifications
                                </p>
                            )}
                        </div>
                    </Card>
                )}

                {/* Blockchain Info */}
                {product.blockchainHash && (
                    <Card className="mb-8 p-8 border border-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950 dark:via-blue-950 dark:to-cyan-950 shadow-lg">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            Blockchain Immutability Certificate
                        </h4>
                        <div className="space-y-5">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Verification Status</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${hasBlockchainConfirmation ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                    <p className={`text-lg font-bold ${hasBlockchainConfirmation ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                        {hasBlockchainConfirmation ? '✓ Confirmed on Blockchain' : '⏳ Pending Confirmation'}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-300 dark:border-slate-700">
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide mb-3">Transaction Hash (Polygon Amoy)</p>
                                <a
                                    href={`https://amoy.polygonscan.com/tx/${product.blockchainHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 p-4 rounded-lg font-mono break-all border border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all group"
                                >
                                    <span className="group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors">{product.blockchainHash}</span>
                                </a>
                            </div>
                            
                            {product.onChainRecord && (
                                <div className="pt-2 border-t border-slate-300 dark:border-slate-700 mt-2">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide mb-3">On-Chain Metdata Proof</p>
                                    <div className="text-xs bg-black/5 dark:bg-black/20 p-4 rounded-lg font-mono space-y-1">
                                        <p className="flex justify-between"><span className="text-slate-500">Exists on Contract:</span> <span className="font-bold text-green-600 dark:text-green-400">Yes</span></p>
                                        <p className="flex justify-between"><span className="text-slate-500">Data Hash:</span> <span className="truncate ml-4">{product.onChainRecord.productHash}</span></p>
                                        <p className="flex justify-between"><span className="text-slate-500">Artisan Reg Addr:</span> <span className="truncate ml-4">{product.onChainRecord.artisan}</span></p>
                                        <p className="flex justify-between"><span className="text-slate-500">Block Timestamp:</span> <span className="truncate ml-4">{new Date(product.onChainRecord.timestamp * 1000).toLocaleString()}</span></p>
                                    </div>
                                </div>
                            )}

                            <p className="text-sm text-slate-600 dark:text-slate-300 pt-2 leading-relaxed mt-2">
                                🔒 This product authenticity is recorded on an immutable blockchain ledger, providing permanent cryptographic proof of authenticity that cannot be altered, forged, or removed.
                            </p>
                        </div>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center border-t border-slate-200 dark:border-slate-700 pt-8 mt-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                        Learn more about supporting authentic heritage crafts
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors">
                        Visit Patrimoine Heritage Platform
                        <span className="text-lg">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
