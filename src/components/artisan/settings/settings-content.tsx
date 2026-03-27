'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface UserSettings {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export function SettingsPageContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [settings, setSettings] = useState<UserSettings>({
        fullName: '',
        email: '',
        phoneNumber: '',
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/artisan/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        fullName: data.fullName || '',
                        email: data.email || '',
                        phoneNumber: data.phoneNumber || '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                setMessage({ type: 'error', text: 'Failed to load settings' });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/artisan/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings updated successfully' });
            } else {
                const error = await res.json();
                setMessage({ type: 'error', text: error.message || 'Failed to update settings' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/artisan/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully' });
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setShowPasswordForm(false);
            } else {
                const error = await res.json();
                setMessage({ type: 'error', text: error.message || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to change password' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 w-full">
            {/* Alert Messages */}
            {message && (
                <div className={`p-4 border rounded-lg flex gap-3 ${message.type === 'success'
                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950'
                    : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                        {message.text}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Settings - Wide */}
                <div className="lg:col-span-2 border border-slate-200 dark:border-slate-700 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-8">Profile Information</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                name="fullName"
                                value={settings.fullName}
                                onChange={handleSettingsChange}
                                placeholder="Your full name"
                                className="focus:ring-2 focus:ring-primary/50 text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={settings.email}
                                onChange={handleSettingsChange}
                                placeholder="your@email.com"
                                disabled
                                className="opacity-50 cursor-not-allowed text-base"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Email address cannot be changed
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                name="phoneNumber"
                                value={settings.phoneNumber}
                                onChange={handleSettingsChange}
                                placeholder="+1 234 567 8900"
                                className="focus:ring-2 focus:ring-primary/50 text-base"
                            />
                        </div>

                        <Button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Security Settings - Sidebar */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-8">Security</h2>

                    {!showPasswordForm ? (
                        <Button
                            onClick={() => setShowPasswordForm(true)}
                            variant="outline"
                            className="w-full border-slate-300 dark:border-border text-slate-900 dark:text-foreground hover:bg-slate-50 dark:hover:bg-muted py-6 text-base"
                        >
                            Change Password
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Current Password
                                </label>
                                <Input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your current password"
                                    className="focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password (min 8 characters)"
                                    className="focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Confirm Password
                                </label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    className="focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="flex flex-col gap-2 pt-4">
                                <Button
                                    onClick={handleChangePassword}
                                    disabled={saving}
                                    className="w-full bg-primary hover:bg-primary/90 text-white py-5"
                                >
                                    {saving ? 'Updating...' : 'Update Password'}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    variant="outline"
                                    className="w-full border-slate-300 dark:border-border text-slate-900 dark:text-foreground hover:bg-slate-50 dark:hover:bg-muted py-5"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone - Full Width */}
            <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-8 bg-red-50 dark:bg-red-950/30">
                <h2 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-2">Danger Zone</h2>
                <p className="text-sm text-red-800 dark:text-red-300 mb-6">
                    These actions cannot be undone. Please proceed with caution.
                </p>
                <Button
                    disabled
                    className="w-full bg-red-600 hover:bg-red-700 text-white opacity-50 cursor-not-allowed py-6 text-base"
                >
                    Deactivate Account (Coming Soon)
                </Button>
            </div>
        </div>
    );
}
