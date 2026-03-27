'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Verification {
    id: string;
    productName: string;
    productId: string;
    scanHash: string;
    timestamp: string;
    blockchainTx?: string;
    status: 'pending' | 'verified' | 'invalid';
}

export function VerificationsPageContent() {
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'invalid'>('all');

    useEffect(() => {
        const fetchVerifications = async () => {
            try {
                const res = await fetch('/api/artisan/verifications');
                if (res.ok) {
                    const data = await res.json();
                    setVerifications(data.verifications || []);
                }
            } catch (error) {
                console.error('Failed to fetch verifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVerifications();
    }, []);

    const filteredVerifications = filter === 'all'
        ? verifications
        : verifications.filter(v => v.status === filter);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified':
                return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            case 'invalid':
                return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border-0">Verified</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border-0">Pending</Badge>;
            case 'invalid':
                return <Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border-0">Invalid</Badge>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Filter skeleton */}
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-32" />
                    ))}
                </div>

                {/* Verifications skeleton */}
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <Skeleton className="h-5 w-1/2 mb-3" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap border-b border-slate-200 dark:border-slate-700 pb-4">
                {[
                    { label: 'All', value: 'all', count: verifications.length },
                    { label: 'Verified', value: 'verified', count: verifications.filter(v => v.status === 'verified').length },
                    { label: 'Pending', value: 'pending', count: verifications.filter(v => v.status === 'pending').length },
                    { label: 'Invalid', value: 'invalid', count: verifications.filter(v => v.status === 'invalid').length },
                ].map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value as any)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === tab.value
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        {tab.label} <span className="ml-1 text-xs opacity-75">({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* Verifications List */}
            {filteredVerifications.length > 0 ? (
                <div className="space-y-3">
                    {filteredVerifications.map((verification) => (
                        <div key={verification.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="mt-0.5 flex-shrink-0">{getStatusIcon(verification.status)}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-50 truncate">
                                            {verification.productName}
                                        </h3>
                                        <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                            <p>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Hash:</span>
                                                <code className="ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-xs">
                                                    {verification.scanHash.substring(0, 16)}...
                                                </code>
                                            </p>
                                            <p>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Date:</span> {' '}
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {format(new Date(verification.timestamp), 'PPp')}
                                                </span>
                                            </p>
                                            {verification.blockchainTx && (
                                                <p>
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">TX:</span>
                                                    <code className="ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-xs">
                                                        {verification.blockchainTx.substring(0, 12)}...
                                                    </code>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    {getStatusBadge(verification.status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-900 dark:text-slate-200 font-medium">No verifications found</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                        {filter === 'all' ? 'When someone scans your product QR code, it will appear here' : 'Try adjusting your filter'}
                    </p>
                </div>
            )}

            {/* Summary Stats */}
            {verifications.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
                            Total Verifications
                        </p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                            {verifications.length}
                        </p>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
                            Verified
                        </p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {verifications.filter(v => v.status === 'verified').length}
                        </p>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600 dark:text-yellow-400 mb-2">
                            Pending
                        </p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {verifications.filter(v => v.status === 'pending').length}
                        </p>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-2">
                            Invalid
                        </p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {verifications.filter(v => v.status === 'invalid').length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
