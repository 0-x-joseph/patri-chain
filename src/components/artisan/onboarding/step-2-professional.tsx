'use client';

import { ChangeEvent } from 'react';

interface Step2Props {
    data: any;
    onChange: (data: any) => void;
}

const CRAFT_CATEGORIES = [
    'Leather Work',
    'Textile & Weaving',
    'Woodcarving',
    'Metalwork',
    'Ceramics & Pottery',
    'Jewelry',
    'Carpentry',
    'Traditional Painting',
    'Damask & Engraving',
    'Other',
];

export function Step2Professional({ data, onChange }: Step2Props) {
    const handleInputChange = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange({ [field]: e.target.value });
    };

    return (
        <div className="space-y-6 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Professional Information
            </h2>

            {/* Artisan License */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Artisan License Number
                </label>
                <input
                    type="text"
                    value={data.artisanLicense || ''}
                    onChange={handleInputChange('artisanLicense')}
                    placeholder="License number"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                />
            </div>

            {/* Craft Category */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Craft Category
                </label>
                <select
                    value={data.craftCategory || ''}
                    onChange={handleInputChange('craftCategory')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                >
                    <option value="">Select a category</option>
                    {CRAFT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Years of Experience */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Years of Experience
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={data.yearsExperience || ''}
                    onChange={handleInputChange('yearsExperience')}
                    placeholder="Number of years"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                />
            </div>

            {/* Workshop Location */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Workshop Location / Address
                </label>
                <input
                    type="text"
                    value={data.workshopLocation || ''}
                    onChange={handleInputChange('workshopLocation')}
                    placeholder="City, neighborhood, or full address"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                />
            </div>
        </div>
    );
}
