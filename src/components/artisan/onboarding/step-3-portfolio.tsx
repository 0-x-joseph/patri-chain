'use client';

import { ChangeEvent } from 'react';

interface Step3Props {
    data: any;
    onChange: (data: any) => void;
}

export function Step3Portfolio({ data, onChange }: Step3Props) {
    const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ bio: e.target.value });
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPhotos = Array.from(files).slice(0, 5);
            onChange({
                portfolioPhotos: [
                    ...(data.portfolioPhotos || []),
                    ...newPhotos,
                ].slice(0, 5),
            });
        }
    };

    const removePhoto = (index: number) => {
        const updated = (data.portfolioPhotos || []).filter((_: any, i: number) => i !== index);
        onChange({ portfolioPhotos: updated });
    };

    const handleSocialChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        onChange({
            socialLinks: {
                ...data.socialLinks,
                [field]: e.target.value,
            },
        });
    };

    return (
        <div className="space-y-6 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Portfolio & Social Media
            </h2>

            {/* Bio */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    About You & Your Craft
                </label>
                <textarea
                    value={data.bio || ''}
                    onChange={handleBioChange}
                    maxLength={500}
                    rows={4}
                    placeholder="Tell us about your craft, inspiration, and journey"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm resize-none"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {(data.bio || '').length} / 500 characters
                </p>
            </div>

            {/* Portfolio Photos */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Portfolio Photos (up to 5)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="w-full text-sm mb-3"
                />
                {data.portfolioPhotos && data.portfolioPhotos.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {data.portfolioPhotos.map((photo: any, idx: number) => (
                            <div key={idx} className="relative">
                                <div className="w-full h-24 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="text-xs text-slate-600 dark:text-slate-400 text-center px-2">
                                        {(photo as File).name.slice(0, 15)}...
                                    </span>
                                </div>
                                <button
                                    onClick={() => removePhoto(idx)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Social Media Links */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Social Media (Optional)
                </label>

                <input
                    type="text"
                    value={data.socialLinks?.facebook || ''}
                    onChange={handleSocialChange('facebook')}
                    placeholder="Facebook page or profile URL"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                />

                <input
                    type="text"
                    value={data.socialLinks?.instagram || ''}
                    onChange={handleSocialChange('instagram')}
                    placeholder="Instagram profile URL"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                />

                <input
                    type="text"
                    value={data.socialLinks?.website || ''}
                    onChange={handleSocialChange('website')}
                    placeholder="Website or portfolio URL"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                />
            </div>
        </div>
    );
}
