'use client';

import { ChangeEvent } from 'react';

interface Step1Props {
    data: any;
    onChange: (data: any) => void;
}

export function Step1PersonalInfo({ data, onChange }: Step1Props) {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange({ profilePhoto: file });
        }
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange({ dateOfBirth: e.target.value });
    };

    const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange({ gender: e.target.value });
    };

    return (
        <div className="space-y-6 border border-slate-200 dark:border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Personal Information
            </h2>

            {/* Profile Photo */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Profile Photo
                </label>
                <div className="flex items-center gap-4">
                    {data.profilePhoto && data.profilePhoto instanceof File ? (
                        <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-muted flex items-center justify-center">
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                                {data.profilePhoto.name.slice(0, 10)}...
                            </span>
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-border flex items-center justify-center">
                            <span className="text-xs text-slate-400">No image</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1 text-sm"
                    />
                </div>
            </div>

            {/* Date of Birth */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date of Birth
                </label>
                <input
                    type="date"
                    value={data.dateOfBirth || ''}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded text-sm"
                />
            </div>

            {/* Gender */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Gender
                </label>
                <select
                    value={data.gender || ''}
                    onChange={handleGenderChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border bg-white dark:bg-card text-slate-900 dark:text-foreground rounded text-sm"
                >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
    );
}
