'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFetch } from '@/lib/hooks';
import { brandsService } from '@/lib/services';
import { Carousel } from '@/components/organisms/Carousel';
import type { Brand } from '@/lib/types';

// ============================================================================
// Brand Card Component
// ============================================================================

interface BrandCardProps {
    brand: Brand;
}

function BrandCard({ brand }: BrandCardProps) {
    return (
        <Link
            href={`/brand/${brand.slug}`}
            className="group flex flex-col items-center gap-3 md:gap-4"
        >
            <div className="relative w-32 h-32 md:w-38 md:h-38 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-[#fe0090] transition-all duration-300 bg-white flex items-center justify-center group-hover:scale-105">
                <Image
                    src={brand.imageUrl || '/placeholder.png'}
                    alt={brand.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <h3 className="font-bold text-[#3f4c53] text-base md:text-base text-center group-hover:text-[#fe0090] transition-colors whitespace-nowrap px-2 leading-tight">
                {brand.name}
            </h3>
        </Link>
    );
}

// ============================================================================
// Featured Brands Component
// ============================================================================

export function FeaturedBrands() {
    const { data: brands, loading, error, refetch } = useFetch<Brand[]>(
        () => brandsService.getFeatured()
    );

    return (
        <section className="py-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-2xl font-bold text-[#3f4c53] mb-10 md:mb-8">
                    Nos Marques
                </h2>

                <Carousel
                    items={brands || []}
                    renderItem={(brand) => <BrandCard brand={brand} />}
                    loading={loading}
                    error={error}
                    onRetry={refetch}
                    emptyMessage="Aucune marque disponible pour le moment"
                />
            </div>
        </section>
    );
}
