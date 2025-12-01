import { useState, useEffect } from 'react';
import type { Category, Brand, FeaturedProduct } from '@/lib/types/showcase';

interface UseShowcaseDataReturn {
    categories: Category[];
    brands: Brand[];
    featuredProducts: FeaturedProduct[];
    loading: boolean;
    error: Error | null;
    fetchData: () => Promise<void>;
    setCategories: (categories: Category[]) => void;
    setBrands: (brands: Brand[]) => void;
    setFeaturedProducts: (products: FeaturedProduct[]) => void;
}

export function useShowcaseData(): UseShowcaseDataReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [catsRes, brandsRes, prodsRes] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/brands'),
                fetch('/api/featured-products')
            ]);

            const catsData = await catsRes.json();
            const brandsData = await brandsRes.json();
            const prodsData = await prodsRes.json();

            // Flatten categories
            const flatten = (list: any[]): Category[] => {
                let result: Category[] = [];
                list.forEach(item => {
                    const cat: Category = { ...item, type: 'category' };
                    result.push(cat);
                    if (item.children) result = result.concat(flatten(item.children));
                });
                return result;
            };

            setCategories(flatten(catsData));
            setBrands(brandsData.map((b: any) => ({ ...b, type: 'brand' })));
            setFeaturedProducts(prodsData.map((p: any) => ({ ...p, type: 'product' })));
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        categories,
        brands,
        featuredProducts,
        loading,
        error,
        fetchData,
        setCategories,
        setBrands,
        setFeaturedProducts,
    };
}
