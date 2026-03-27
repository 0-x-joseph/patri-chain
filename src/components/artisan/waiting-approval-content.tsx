'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/app/actions/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface UserProfile {
    fullName: string;
    email: string;
    artisanStatus: 'pending' | 'approved' | 'rejected';
}

export function WaitingApprovalContent() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/artisan/profile');
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Redirect to dashboard if approved
    useEffect(() => {
        if (profile?.artisanStatus === 'approved') {
            router.push('/artisan/dashboard');
        }
    }, [profile?.artisanStatus, router]);

    const handleLogout = async () => {
        await logoutUser();
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    const isPending = profile?.artisanStatus === 'pending';
    const isRejected = profile?.artisanStatus === 'rejected';
    const isApproved = profile?.artisanStatus === 'approved';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Onboarding Complete */}
                <Card className="mb-6 p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                Onboarding Complete
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Thank you for completing your profile, {profile?.fullName}. Your application has been submitted for review.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Status Section */}
                {isPending && (
                    <Card className="mb-6 p-6 border-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950">
                        <div className="flex items-start gap-4">
                            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                                    Pending Admin Review
                                </h2>
                                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                                    Our admin team is reviewing your artisan profile. This typically takes 1-3 business days.
                                </p>
                                <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                                    <li>✓ Profile submitted</li>
                                    <li>⏳ Awaiting admin verification</li>
                                    <li>📧 You'll be notified when approved</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                )}

                {isRejected && (
                    <Card className="mb-6 p-6 border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">
                                    Application Rejected
                                </h2>
                                <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                                    Unfortunately, your application was not approved. Please contact our support team for more information.
                                </p>
                                <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                                    Email: support@patrimoine.com
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {isApproved && (
                    <Card className="mb-6 p-6 border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-lg font-bold text-green-900 dark:text-green-200 mb-2">
                                    Account Approved!
                                </h2>
                                <p className="text-sm text-green-800 dark:text-green-300">
                                    Your account has been approved. You can now access the dashboard and start managing your products.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* User Info */}
                <Card className="mb-6 p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Account Information</h3>
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div>
                            <span className="font-medium text-slate-900 dark:text-white">Name:</span> {profile?.fullName}
                        </div>
                        <div>
                            <span className="font-medium text-slate-900 dark:text-white">Email:</span> {profile?.email}
                        </div>
                        <div>
                            <span className="font-medium text-slate-900 dark:text-white">Status:</span>{' '}
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${isPending ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                    isRejected ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                }`}>
                                {profile?.artisanStatus ? profile.artisanStatus.charAt(0).toUpperCase() + profile.artisanStatus.slice(1) : 'Unknown'}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* What's Next */}
                {isPending && (
                    <Card className="mb-6 p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">While You Wait</h3>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                            <li>✓ Check your email regularly for updates</li>
                            <li>✓ Ensure your profile information is accurate</li>
                            <li>✓ Prepare your product photos and descriptions</li>
                            <li>✓ Review the Patrimoine platform guidelines</li>
                        </ul>
                    </Card>
                )}

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}
