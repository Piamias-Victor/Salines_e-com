import { apiClient } from './api';
import { API_CONFIG } from '@/lib/constants';
import type { Product, FetchOptions } from '@/lib/types';

// ============================================================================
// Products Service
// ============================================================================

export const productsService = {
    /**
     * Get featured products
     */
    getFeatured: async (options?: FetchOptions): Promise<Product[]> => {
        return apiClient.get<Product[]>(
            `${API_CONFIG.ENDPOINTS.PRODUCTS}/featured`,
            {
                limit: options?.limit || API_CONFIG.LIMITS.FEATURED_PRODUCTS,
                ...options,
            }
        );
    },

    /**
     * Get product by ID
     */
    getById: async (id: string): Promise<Product> => {
        return apiClient.get<Product>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
    },

    /**
     * Get product by slug
     */
    getBySlug: async (slug: string): Promise<Product> => {
        return apiClient.get<Product>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/slug/${slug}`);
    },

    /**
     * Get all products
     */
    getAll: async (options?: FetchOptions): Promise<Product[]> => {
        return apiClient.get<Product[]>(API_CONFIG.ENDPOINTS.PRODUCTS, options);
    },

    /**
     * Search products
     */
    search: async (query: string, options?: FetchOptions): Promise<Product[]> => {
        return apiClient.get<Product[]>(
            `${API_CONFIG.ENDPOINTS.PRODUCTS}/search`,
            {
                ...options,
                params: { q: query } as any,
            }
        );
    },
};
