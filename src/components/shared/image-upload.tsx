'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    onImageUpload?: (url: string) => void;
    currentImage?: string | null;
    label?: string;
}

export function ImageUpload({ onImageUpload, currentImage, label = 'Product Image' }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    setPreview(e.target.result);
                }
            };
            reader.readAsDataURL(file);

            // Upload to server
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const imageUrl = data.secure_url;

            if (onImageUpload) {
                onImageUpload(imageUrl);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setPreview(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-900 dark:text-foreground">
                {label}
            </label>

            {preview ? (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-border"
                    />
                    <Button
                        onClick={handleRemove}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white dark:bg-background"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <label className="flex items-center justify-center w-full h-48 px-4 transition bg-white dark:bg-card border-2 border-dashed rounded-lg border-slate-200 dark:border-border cursor-pointer hover:border-slate-300 dark:hover:border-border">
                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-600">
                            PNG, JPG or GIF (max 5MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="hidden"
                    />
                </label>
            )}

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            {isLoading && (
                <p className="text-sm text-slate-600 dark:text-slate-400">Uploading...</p>
            )}
        </div>
    );
}
