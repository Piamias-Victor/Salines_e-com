import { apiClient } from './api';
import { API_CONFIG } from '@/lib/constants';
import type { Category, FetchOptions } from '@/lib/types';

// ============================================================================
// Categories Service
// ============================================================================

export const categoriesService = {
    /**
     * Get featured categories (for "Nos Univers")
     */
    getFeatured: async (options?: FetchOptions): Promise<Category[]> => {
        return apiClient.get<Category[]>(
            `${API_CONFIG.ENDPOINTS.CATEGORIES}/featured`,
            {
                limit: options?.limit || API_CONFIG.LIMITS.FEATURED_CATEGORIES,
                ...options,
            }
        );
    },

    /**
     * Get search categories (for Search Drawer)
     */
    getSearch: async (): Promise<Category[]> => {
        return apiClient.get<Category[]>(`${API_CONFIG.ENDPOINTS.CATEGORIES}/search`, { params: { visible: 'true' } });
    },

    /**
     * Get menu categories (for Mega Menu)
     */
    getMenu: async (options?: FetchOptions): Promise<Category[]> => {
        return apiClient.get<Category[]>(API_CONFIG.ENDPOINTS.CATEGORIES, { ...options, params: { ...options?.params, visible: 'true' } });
    },

    /**
     * Get category by ID
     */
    getById: async (id: string): Promise<Category> => {
        return apiClient.get<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
    },

    /**
     * Get category by slug
     */
    getBySlug: async (slug: string): Promise<Category> => {
        return apiClient.get<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES}/slug/${slug}`);
    },

    /**
     * Get all categories
     */
    getAll: async (options?: FetchOptions): Promise<Category[]> => {
        return apiClient.get<Category[]>(API_CONFIG.ENDPOINTS.CATEGORIES, options);
    },
};
