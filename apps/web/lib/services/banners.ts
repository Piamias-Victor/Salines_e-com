import { apiClient } from './api';
import { API_CONFIG } from '@/lib/constants';
import type { Banner, FetchOptions } from '@/lib/types';

// ============================================================================
// Banners Service
// ============================================================================

export const bannersService = {
    /**
     * Get active banners
     */
    getActive: async (options?: FetchOptions): Promise<Banner[]> => {
        return apiClient.get<Banner[]>(
            API_CONFIG.ENDPOINTS.BANNERS,
            {
                limit: options?.limit || API_CONFIG.LIMITS.BANNERS,
                ...options,
            }
        );
    },

    /**
     * Get banner by ID
     */
    getById: async (id: string): Promise<Banner> => {
        return apiClient.get<Banner>(`${API_CONFIG.ENDPOINTS.BANNERS}/${id}`);
    },

    /**
     * Get all banners
     */
    getAll: async (options?: FetchOptions): Promise<Banner[]> => {
        return apiClient.get<Banner[]>(API_CONFIG.ENDPOINTS.BANNERS, options);
    },
};
