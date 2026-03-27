'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Download as DownloadIcon, Trash2, Printer } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

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

export function ProductDetailContent({ productId }: { productId: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'verifications' | 'blockchain'>('details');
    const [showQRCode, setShowQRCode] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    async function fetchProductDetails() {
        try {
            const response = await fetch(`/api/artisan/products/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const data = await response.json();
            setProduct(data.product);
            setVerifications(data.verifications || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const downloadQRCode = () => {
        if (!qrRef.current || !product) return;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;

        // Convert SVG to canvas then to PNG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `${product.name.replace(/\s+/g, '-')}-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const printQRCode = () => {
        if (!qrRef.current || !product) return;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;

        const printWindow = window.open('', '', 'height=400,width=600');
        if (!printWindow) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
            printWindow.document.write(`
                <html>
                <head>
                    <title>${product.name} - QR Code</title>
                    <style>
                        body { 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            padding: 20px; 
                            font-family: Arial, sans-serif;
                        }
                        canvas { max-width: 400px; margin: 20px 0; }
                        h1 { margin: 10px 0; }
                        p { margin: 5px 0; }
                        .qr-container { text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <h1>${product.name}</h1>
                        <p>${product.category}</p>
                        <canvas id="printCanvas"></canvas>
                        <p style="font-size: 12px; color: #666;">Scan this QR code to verify product authenticity</p>
                    </div>
                    <script>
                        const canvas = document.getElementById('printCanvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            setTimeout(() => window.print(), 250);
                        };
                        img.src = 'data:image/svg+xml;base64,${btoa(svgData)}';
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-600 dark:text-slate-400">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="space-y-4">
                <Link
                    href="/artisan/products"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-600 dark:text-red-400">Error: {error || 'Product not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/artisan/products"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
            </Link>

            {/* Product Header */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                    {/* Image */}
                    {product.imageUrl ? (
                        <div className="w-full lg:w-48 h-48 rounded bg-slate-200 dark:bg-slate-800">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full lg:w-48 h-48 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="text-slate-400">No image</span>
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {product.name}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {product.category}
                            </p>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 text-sm">
                            {product.description}
                        </p>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`text-xs font-medium px-3 py-1 rounded border ${product.status === 'verified'
                                    ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                                    : product.status === 'pending'
                                        ? 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                                        : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                                    }`}
                            >
                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>

                            <span
                                className={`text-xs font-medium px-3 py-1 rounded border ${product.blockchainStatus === 'confirmed'
                                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                    : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200'
                                    }`}
                            >
                                Blockchain: {product.blockchainStatus.charAt(0).toUpperCase() + product.blockchainStatus.slice(1)}
                            </span>
                        </div>

                        {/* Verifications Count */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {product.verificationCount}
                                </span>{' '}
                                verification{product.verificationCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    {(['details', 'verifications', 'blockchain'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Details Tab */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Created</span>
                                <p className="text-slate-900 dark:text-white">
                                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>

                            {/* QR Code Section */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                {!showQRCode ? (
                                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Generate QR code for customers to verify this product
                                        </p>
                                        <button
                                            onClick={() => setShowQRCode(true)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                                        >
                                            Generate QR Code
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <div ref={qrRef} className="p-4 bg-white rounded">
                                                <QRCodeSVG
                                                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/product/verify/${product.id}`}
                                                    size={256}
                                                    level="H"
                                                    includeMargin={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={downloadQRCode}
                                                className="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <DownloadIcon className="w-4 h-4" />
                                                Download
                                            </button>
                                            <button
                                                onClick={printQRCode}
                                                className="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <Printer className="w-4 h-4" />
                                                Print
                                            </button>
                                            <button
                                                onClick={() => setShowQRCode(false)}
                                                className="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Hide
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                                <button className="flex items-center gap-2 px-3 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded text-sm hover:bg-red-50 dark:hover:bg-red-800/20 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                    Deactivate
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Verifications Tab */}
                    {activeTab === 'verifications' && (
                        <div className="space-y-4">
                            {verifications.length === 0 ? (
                                <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                                    No verifications yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {verifications.map((verification, idx) => (
                                        <div
                                            key={verification.id}
                                            className="flex items-start gap-4 p-3 border border-slate-200 dark:border-slate-700 rounded"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-900 dark:text-white font-medium">
                                                    {new Date(verification.timestamp).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                    Status: {verification.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Blockchain Tab */}
                    {activeTab === 'blockchain' && (
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                                <p className="text-slate-900 dark:text-white font-medium mt-1">
                                    {product.blockchainStatus === 'confirmed'
                                        ? 'Confirmed on blockchain'
                                        : 'Pending blockchain confirmation'}
                                </p>
                            </div>

                            {product.blockchainHash && (
                                <div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Transaction Hash</span>
                                    <p className="text-slate-900 dark:text-white text-xs font-mono break-all mt-1">
                                        {product.blockchainHash}
                                    </p>
                                </div>
                            )}

                            <p className="text-xs text-slate-600 dark:text-slate-400 pt-4">
                                Blockchain verification provides immutable proof of your product's authenticity and ownership.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
