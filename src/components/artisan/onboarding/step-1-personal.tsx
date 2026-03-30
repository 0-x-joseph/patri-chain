'use client';

import { ChangeEvent } from 'react';
import { ImageUpload } from '@/components/shared/image-upload';

interface Step1Props {
    data: any;
    onChange: (data: any) => void;
}

export function Step1PersonalInfo({ data, onChange }: Step1Props) {
    const handleProfilePhotoUpload = (url: string) => {
        onChange({ profilePhotoUrl: url });
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
                <ImageUpload 
                    label="Profile Photo"
                    currentImage={data.profilePhotoUrl}
                    onImageUpload={handleProfilePhotoUpload}
                />
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
