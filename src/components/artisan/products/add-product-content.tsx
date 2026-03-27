'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';

const productSchema = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    category: z.string().min(1, 'Please select a category'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500),
    price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Price must be a positive number'),
    materials: z.string().optional(),
    dimensions: z.string().optional(),
    productionDate: z.string().optional(),
    videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

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

export function AddProductContent() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            description: '',
        },
    });

    const [primaryPhoto, setPrimaryPhoto] = useState<File | null>(null);
    const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
    const [submitError, setSubmitError] = useState<string>('');
    const [isComplete, setIsComplete] = useState(false);
    const [qrCode, setQrCode] = useState<string>('');

    const description = watch('description');

    // Auto-save form data to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            const formData = {
                ...watch(),
                primaryPhoto: primaryPhoto ? primaryPhoto.name : null,
                additionalPhotos: additionalPhotos.map((f) => f.name),
            };
            localStorage.setItem('addProductDraft', JSON.stringify(formData));
        }, 500);
        return () => clearTimeout(timer);
    }, [watch, primaryPhoto, additionalPhotos]);

    const handlePrimaryPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPrimaryPhoto(file);
        }
    };

    const handleAdditionalPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPhotos = Array.from(files).slice(0, 5 - additionalPhotos.length);
            setAdditionalPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
        }
    };

    const removeAdditionalPhoto = (index: number) => {
        setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ProductFormData) => {
        setSubmitError('');

        if (!primaryPhoto) {
            setSubmitError('Primary photo is required');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('category', data.category);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('materials', data.materials || '');
            formData.append('dimensions', data.dimensions || '');
            formData.append('productionDate', data.productionDate || '');
            formData.append('videoUrl', data.videoUrl || '');
            formData.append('primaryPhoto', primaryPhoto);

            additionalPhotos.forEach((photo, idx) => {
                formData.append(`additionalPhoto${idx}`, photo);
            });

            const response = await fetch('/api/artisan/products', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to add product');
            }

            // Clear draft
            localStorage.removeItem('addProductDraft');

            // Set QR code and show success
            setQrCode(result.qrCode || '');
            setIsComplete(true);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to add product');
        }
    };

    if (isComplete) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-12">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center space-y-6">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                            Product Added Successfully
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Your product is now registered and ready for verification.
                        </p>
                    </div>

                    {qrCode && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Your QR Code:
                            </p>
                            <div
                                dangerouslySetInnerHTML={{ __html: qrCode }}
                                className="flex justify-center"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 justify-center pt-4">
                        <a
                            href="/artisan/products"
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded text-sm transition-colors"
                        >
                            View Products
                        </a>
                        <a
                            href="/artisan/products/new"
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-sm transition-colors"
                        >
                            Add Another
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded text-sm text-red-700 dark:text-red-400">
                        {submitError}
                    </div>
                )}

                {/* Name */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Product Details</h3>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Product Name
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="E.g., Handwoven Moroccan Carpet"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Category
                        </label>
                        <select
                            {...register('category')}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                        >
                            <option value="">Select a category</option>
                            {CRAFT_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            maxLength={500}
                            placeholder="Describe your product, its features, and craftsmanship"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm resize-none"
                        />
                        <div className="flex justify-between mt-1">
                            {errors.description && (
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {errors.description.message}
                                </p>
                            )}
                            <p className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                                {description.length} / 500
                            </p>
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Price (MAD)
                        </label>
                        <input
                            type="number"
                            {...register('price')}
                            placeholder="1000"
                            step="0.01"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                        />
                        {errors.price && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {errors.price.message}
                            </p>
                        )}
                    </div>

                    {/* Materials */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Materials (Optional)
                        </label>
                        <input
                            type="text"
                            {...register('materials')}
                            placeholder="E.g., Wool, Silk, Natural Dyes"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                        />
                    </div>

                    {/* Dimensions */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Dimensions (Optional)
                        </label>
                        <input
                            type="text"
                            {...register('dimensions')}
                            placeholder="E.g., 200cm x 150cm"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                        />
                    </div>

                    {/* Production Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Production Date (Optional)
                        </label>
                        <input
                            type="date"
                            {...register('productionDate')}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                        />
                    </div>

                    {/* Video URL */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Video URL (Optional)
                        </label>
                        <input
                            type="url"
                            {...register('videoUrl')}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded text-sm"
                        />
                        {errors.videoUrl && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {errors.videoUrl.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Photos */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Photos</h3>

                    {/* Primary Photo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Primary Photo (Required)
                        </label>
                        {primaryPhoto ? (
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="text-xs text-slate-600 dark:text-slate-400 text-center px-2">
                                        {primaryPhoto.name.slice(0, 15)}...
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPrimaryPhoto(null)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePrimaryPhotoChange}
                                className="w-full text-sm"
                            />
                        )}
                    </div>

                    {/* Additional Photos */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Additional Photos (up to 5)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalPhotosChange}
                            disabled={additionalPhotos.length >= 5}
                            className="w-full text-sm"
                        />
                        {additionalPhotos.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                {additionalPhotos.map((photo, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="w-full h-24 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400 text-center px-2">
                                                {photo.name.slice(0, 15)}...
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalPhoto(idx)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <a
                        href="/artisan/products"
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-sm transition-colors"
                    >
                        Cancel
                    </a>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-auto px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        {isSubmitting ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
