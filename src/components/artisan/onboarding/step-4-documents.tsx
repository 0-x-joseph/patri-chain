'use client';

import { ChangeEvent } from 'react';

interface Step4Props {
    data: any;
    onChange: (data: any) => void;
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
    return (
        <div className="flex items-center justify-between p-3 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800">
            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                {file.name}
            </span>
            <button
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
            >
                Remove
            </button>
        </div>
    );
}

export function Step4Documents({ data, onChange }: Step4Props) {
    const handleFileChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange({ [field]: file });
        }
    };

    const handleRemove = (field: string) => {
        onChange({ [field]: undefined });
    };

    return (
        <div className="space-y-6 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Verification Documents
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload clear photos or scans of your verification documents. These help us verify your identity and credentials.
            </p>

            {/* Government ID */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Government ID (Passport, National ID, Driver's License)
                </label>
                {data.governmentId ? (
                    <FilePreview
                        file={data.governmentId}
                        onRemove={() => handleRemove('governmentId')}
                    />
                ) : (
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange('governmentId')}
                        className="w-full text-sm"
                    />
                )}
            </div>

            {/* Artisan Card / License */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Artisan Card / Professional License Photo
                </label>
                {data.artisanCard ? (
                    <FilePreview
                        file={data.artisanCard}
                        onRemove={() => handleRemove('artisanCard')}
                    />
                ) : (
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange('artisanCard')}
                        className="w-full text-sm"
                    />
                )}
            </div>

            {/* Workshop Photo */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Workshop/Studio Photo
                </label>
                {data.workshopPhoto ? (
                    <FilePreview
                        file={data.workshopPhoto}
                        onRemove={() => handleRemove('workshopPhoto')}
                    />
                ) : (
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange('workshopPhoto')}
                        className="w-full text-sm"
                    />
                )}
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded text-sm text-amber-800 dark:text-amber-200">
                ⚠️ All documents will be verified by our admin team. Make sure they are clear and legible.
            </div>
        </div>
    );
}
