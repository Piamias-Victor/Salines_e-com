import { apiClient } from './api';
import { API_CONFIG } from '@/lib/constants';
import type { Promotion, FetchOptions } from '@/lib/types';

// ============================================================================
// Promotions Service
// ============================================================================

export const promotionsService = {
    /**
     * Get active promotions
     */
    getActive: async (options?: FetchOptions): Promise<Promotion[]> => {
        return apiClient.get<Promotion[]>(
            API_CONFIG.ENDPOINTS.PROMOTIONS,
            {
                limit: options?.limit || API_CONFIG.LIMITS.PROMOTIONS,
                ...options,
            }
        );
    },

    /**
     * Get promotion by ID
     */
    getById: async (id: string): Promise<Promotion> => {
        return apiClient.get<Promotion>(`${API_CONFIG.ENDPOINTS.PROMOTIONS}/${id}`);
    },

    /**
     * Get all promotions
     */
    getAll: async (options?: FetchOptions): Promise<Promotion[]> => {
        return apiClient.get<Promotion[]>(API_CONFIG.ENDPOINTS.PROMOTIONS, options);
    },
};
