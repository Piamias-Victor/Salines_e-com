'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FetchState } from '@/lib/types';

// ============================================================================
// useFetch Hook
// ============================================================================

interface UseFetchOptions<T> {
    initialData?: T | null;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    enabled?: boolean;
}

interface UseFetchReturn<T> extends FetchState<T> {
    refetch: () => Promise<void>;
    reset: () => void;
}

export function useFetch<T>(
    fetcher: () => Promise<T>,
    options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
    const {
        initialData = null,
        onSuccess,
        onError,
        enabled = true,
    } = options;

    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState<boolean>(enabled);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const result = await fetcher();
            setData(result);
            onSuccess?.(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            onError?.(errorMessage);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [fetcher, enabled, onSuccess, onError]);

    const reset = useCallback(() => {
        setData(initialData);
        setError(null);
        setLoading(false);
    }, [initialData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        reset,
    };
}
