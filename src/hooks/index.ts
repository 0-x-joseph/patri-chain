'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing form input
 */
export function useForm<T extends Record<string, any>>(
    initialValues: T,
    onSubmit: (values: T) => void | Promise<void>
) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setValues(prev => ({ ...prev, [name]: value }));
            // Clear error for this field when user starts typing
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        },
        [errors]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } finally {
                setIsSubmitting(false);
            }
        },
        [values, onSubmit]
    );

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
        setValues,
        setErrors,
    };
}

/**
 * Custom hook for async operations with loading state
 */
export function useAsync<T>(
    fn: () => Promise<T>,
    dependencies: React.DependencyList = []
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fn()
            .then(result => {
                setData(result);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, dependencies);

    return { data, loading, error };
}
