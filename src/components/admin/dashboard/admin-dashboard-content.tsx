'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Package, Clock, CheckSquare } from 'lucide-react';
import { PageHeader } from '@/components/artisan/page-header'; // perfect to reuse

interface DashboardMetrics {
    totalArtisans: number;
    pendingArtisans: number;
    totalProducts: number;
    pendingProducts: number;
    totalVerifications: number;
}

export function AdminDashboardContent() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/admin/dashboard');
                if (!response.ok) throw new Error('Failed to fetch metrics');
                const data = await response.json();
                setMetrics(data.metrics);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                Error loading dashboard: {error}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Artisans',
            value: metrics?.totalArtisans || 0,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            title: 'Pending Artisans',
            value: metrics?.pendingArtisans || 0,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-900/30'
        },
        {
            title: 'Pending Products',
            value: metrics?.pendingProducts || 0,
            icon: Package,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        },
        {
            title: 'Total Verifications',
            value: metrics?.totalVerifications || 0,
            icon: CheckSquare,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admin Dashboard"
                description="Overview of PatriChain platform activity and metrics."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card key={index} className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {card.title}
                                    </p>
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {card.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <Icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Getting Started Guide / Quick Links */}
                <Card className="p-6 border-blue-100 dark:border-blue-900/50 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        <a href="/admin/artisans" className="p-4 rounded-lg border border-slate-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">Review Artisans</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{metrics?.pendingArtisans} pending approval</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs group-hover:scale-110 transition-transform">
                                →
                            </div>
                        </a>

                        <a href="/admin/products" className="p-4 rounded-lg border border-slate-200 dark:border-border hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-amber-500 group-hover:text-amber-600" />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400">Review Products</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{metrics?.pendingProducts} pending verification</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xs group-hover:scale-110 transition-transform">
                                →
                            </div>
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
}