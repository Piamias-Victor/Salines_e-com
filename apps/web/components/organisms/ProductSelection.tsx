'use client';

import { useFetch } from '@/lib/hooks';
import { Carousel } from '@/components/organisms/Carousel';
import { ProductCard } from '@/components/molecules/ProductCard';
import type { Product } from '@/lib/types';

// ============================================================================
// Product Selection Component
// ============================================================================

interface FeaturedProduct {
    id: string;
    product: Product;
}

export function ProductSelection() {
    const { data: featuredProducts, loading, error, refetch } = useFetch<FeaturedProduct[]>(
        async () => {
            const res = await fetch('/api/featured-products');
            if (!res.ok) throw new Error('Failed to fetch featured products');
            return res.json();
        }
    );

    // Extract products from featured products
    const products = featuredProducts?.map(fp => fp.product) || [];

    return (
        <section className="py-10 md:py-12 transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-[#3f4c53] mb-10 md:mb-8">
                    La sélection du pharmacien
                </h2>

                <Carousel
                    items={products}
                    renderItem={(product) => <ProductCard product={product} />}
                    loading={loading}
                    error={error}
                    onRetry={refetch}
                    emptyMessage="Aucun produit disponible pour le moment"
                    itemClassName="w-64"
                />
            </div>
        </section>
    );
}
