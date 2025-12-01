import { apiClient } from './api';
import type { Brand, Category, Product } from '@/lib/types';

export interface GlobalSearchResults {
    brands: Brand[];
    categories: Category[];
    products: Product[];
}

export const searchService = {
    /**
     * Perform a global search across brands, categories, and products
     */
    searchGlobal: async (query: string): Promise<GlobalSearchResults> => {
        if (!query || query.length < 2) {
            return { brands: [], categories: [], products: [] };
        }

        return apiClient.get<GlobalSearchResults>('/api/search/global', {
            params: { q: query }
        });
    }
};
