'use client';

import { useState, useEffect } from 'react';
import { WelcomeHeader } from './welcome-header';
import { StatsCards } from './stats-cards';
import { RecentProducts } from './recent-products';
import { VerificationsTimeline } from './verifications-timeline';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DashboardData {
    user: {
        fullName: string;
        email: string;
    };
    stats: {
        totalProducts: number;
        totalVerifications: number;
        accountStatus: string;
    };
    recentProducts: Array<{
        id: string;
        name: string;
        imageUrl: string | null;
        status: string;
        verificationCount: number;
        blockchainStatus: string;
    }>;
    recentVerifications: Array<{
        id: string;
        productName: string;
        timestamp: string;
        status: string;
        blockchainTx: string | null;
    }>;
}

export function DashboardContent() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            const response = await fetch('/api/artisan/dashboard');
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            const dashboardData = await response.json();
            setData(dashboardData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    <Button onClick={fetchDashboardData} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <WelcomeHeader user={data?.user} />

            <StatsCards stats={isLoading ? null : data?.stats} />

            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Your Products</h2>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                    + Add Product
                </Button>
            </div>

            <RecentProducts products={isLoading ? null : data?.recentProducts} />

            <VerificationsTimeline verifications={isLoading ? null : data?.recentVerifications} />
        </div>
    );
}
