import { API_CONFIG } from '@/lib/constants';
import type { FetchOptions } from '@/lib/types';

// ============================================================================
// Base API Client
// ============================================================================

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit & { params?: Record<string, string | number> }
    ): Promise<T> {
        const { params, ...fetchOptions } = options || {};

        // Build URL with query parameters
        const url = new URL(endpoint, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }

        try {
            const response = await fetch(url.toString(), {
                ...fetchOptions,
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchOptions.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        const { limit, offset, params: customParams, ...fetchOptions } = options || {};

        const params: Record<string, string | number> = {};
        if (limit !== undefined) params.limit = limit;
        if (offset !== undefined) params.offset = offset;

        // Merge custom params (like visible: 'true')
        if (customParams) {
            Object.assign(params, customParams);
        }

        return this.request<T>(endpoint, {
            method: 'GET',
            params,
            ...fetchOptions,
        });
    }

    async post<T>(endpoint: string, data: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        });
    }

    async put<T>(endpoint: string, data: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options,
        });
    }

    async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options,
        });
    }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const apiClient = new ApiClient();

// ============================================================================
// Utility function for server-side fetching
// ============================================================================

export async function fetchApi<T>(
    endpoint: string,
    options?: FetchOptions
): Promise<T> {
    const { limit, offset, cache = 'no-store', revalidate } = options || {};

    const url = new URL(endpoint, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

    if (limit !== undefined) url.searchParams.append('limit', String(limit));
    if (offset !== undefined) url.searchParams.append('offset', String(offset));

    const response = await fetch(url.toString(), {
        cache,
        ...(revalidate !== undefined && { next: { revalidate } }),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}
