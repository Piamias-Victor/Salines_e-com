'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFetch } from '@/lib/hooks';
import { categoriesService } from '@/lib/services';
import { Carousel } from '@/components/organisms/Carousel';
import type { Category } from '@/lib/types';

// ============================================================================
// Category Card Component
// ============================================================================

interface CategoryCardProps {
    category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center gap-3 md:gap-4"
        >
            <div className="relative w-32 h-32 md:w-38 md:h-38 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-[#fe0090] transition-all duration-300 group-hover:scale-105">
                <Image
                    src={category.imageUrl || '/placeholder.png'}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <h3 className="font-bold text-[#3f4c53] text-base md:text-base text-center group-hover:text-[#fe0090] transition-colors px-2 leading-tight">
                {category.name}
            </h3>
        </Link>
    );
}

// ============================================================================
// Featured Categories Component
// ============================================================================

export function FeaturedCategories() {
    const { data: categories, loading, error, refetch } = useFetch<Category[]>(
        () => categoriesService.getFeatured()
    );

    return (
        <section className="py-10 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-2xl font-bold text-[#3f4c53] mb-10 md:mb-8">
                    Nos Univers
                </h2>

                <Carousel
                    items={categories || []}
                    renderItem={(category) => <CategoryCard category={category} />}
                    loading={loading}
                    error={error}
                    onRetry={refetch}
                    emptyMessage="Aucune catégorie disponible pour le moment"
                />
            </div>
        </section>
    );
}
