import { apiClient } from './api';
import { API_CONFIG } from '@/lib/constants';
import type { Brand, FetchOptions } from '@/lib/types';

// ============================================================================
// Brands Service
// ============================================================================

export const brandsService = {
    /**
     * Get featured brands
     */
    getFeatured: async (options?: FetchOptions): Promise<Brand[]> => {
        return apiClient.get<Brand[]>(
            `${API_CONFIG.ENDPOINTS.BRANDS}/featured`,
            {
                limit: options?.limit || API_CONFIG.LIMITS.FEATURED_BRANDS,
                ...options,
            }
        );
    },

    /**
     * Get search brands (for Search Drawer)
     */
    getSearch: async (): Promise<Brand[]> => {
        return apiClient.get<Brand[]>(`${API_CONFIG.ENDPOINTS.BRANDS}/search`, { params: { visible: 'true' } });
    },

    /**
     * Get brand by ID
     */
    getById: async (id: string): Promise<Brand> => {
        return apiClient.get<Brand>(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`);
    },

    /**
     * Get brand by slug
     */
    getBySlug: async (slug: string): Promise<Brand> => {
        return apiClient.get<Brand>(`${API_CONFIG.ENDPOINTS.BRANDS}/slug/${slug}`);
    },

    /**
     * Get all brands
     */
    getAll: async (options?: FetchOptions): Promise<Brand[]> => {
        return apiClient.get<Brand[]>(API_CONFIG.ENDPOINTS.BRANDS, options);
    },
};
