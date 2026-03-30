'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Eye, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/artisan/page-header';
import { format } from 'date-fns';

interface Artisan {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
    productCount: number;
    profile: {
        craftCategory: string;
        workshopLocation: string;
    } | null;
}

export function AdminArtisansContent() {
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Action State
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const fetchArtisans = async (filter = 'all') => {
        setIsLoading(true);
        try {
            const url = filter === 'all' ? '/api/admin/artisans' : `/api/admin/artisans?status=${filter}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch artisans');
            const data = await response.json();
            setArtisans(data.artisans);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArtisans(statusFilter);
    }, [statusFilter]);

    const handleUpdateStatus = async (artisanId: string, newStatus: string) => {
        setIsUpdating(artisanId);
        try {
            const response = await fetch(`/api/admin/artisans/${artisanId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Update local state
            setArtisans(artisans.map(a =>
                a.id === artisanId ? { ...a, status: newStatus } : a
            ));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update');
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Approved</Badge>;
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
                    title="Manage Artisans"
                    description="Review applications and manage artisan accounts."
                />

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
                                <th className="px-6 py-4 font-medium">Artisan</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Craft & Location</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                            Loading artisans...
                                        </div>
                                    </td>
                                </tr>
                            ) : artisans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No artisans found {statusFilter !== 'all' && `with status '${statusFilter}'`}.
                                    </td>
                                </tr>
                            ) : (
                                artisans.map((artisan) => (
                                    <tr key={artisan.id} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{artisan.fullName}</div>
                                            <div className="text-xs text-slate-500">{artisan.productCount} products</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700 dark:text-slate-300">{artisan.email}</div>
                                            <div className="text-slate-500 text-xs">{artisan.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700 dark:text-slate-300">{artisan.profile?.craftCategory || '—'}</div>
                                            <div className="text-slate-500 text-xs">{artisan.profile?.workshopLocation || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {format(new Date(artisan.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(artisan.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {artisan.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                                            onClick={() => handleUpdateStatus(artisan.id, 'approved')}
                                                            disabled={isUpdating === artisan.id}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                                            onClick={() => handleUpdateStatus(artisan.id, 'rejected')}
                                                            disabled={isUpdating === artisan.id}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" /> Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {artisan.status === 'approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-amber-600 border-amber-200 hover:bg-amber-50"
                                                        onClick={() => handleUpdateStatus(artisan.id, 'pending')}
                                                        disabled={isUpdating === artisan.id}
                                                    >
                                                        <ShieldAlert className="w-4 h-4 mr-1" /> Suspend
                                                    </Button>
                                                )}
                                                {/* In a real app we'd open a modal to view full details */}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600" title="View details (Coming soon)">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
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