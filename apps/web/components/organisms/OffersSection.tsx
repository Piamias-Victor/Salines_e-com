'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFetch } from '@/lib/hooks';
import { promotionsService } from '@/lib/services';
import { Carousel } from '@/components/organisms/Carousel';
import type { Promotion } from '@/lib/types';

// ============================================================================
// Promotion Card Component
// ============================================================================

interface PromotionCardProps {
    promotion: Promotion;
}

function PromotionCard({ promotion }: PromotionCardProps) {
    const discountText = promotion.type === 'PERCENTAGE' || promotion.type === 'PERCENT'
        ? `-${promotion.amount}%`
        : `-${promotion.amount}€`;

    return (
        <div className="w-[calc(100vw-2rem)] sm:w-96">
            <div className="relative h-72 sm:h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <Image
                    src={promotion.imageUrl}
                    alt={promotion.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                    <div className="mb-3 sm:mb-3">
                        <span className="inline-block bg-[#fe0090] text-white px-5 py-2.5 sm:px-4 sm:py-2 rounded-full text-3xl sm:text-2xl font-bold shadow-lg">
                            {discountText}
                        </span>
                    </div>
                    <h3 className="text-white text-2xl sm:text-xl font-bold mb-4 sm:mb-3 leading-tight">
                        {promotion.title}
                    </h3>
                    <Link
                        href={promotion.redirectUrl}
                        className="inline-block px-8 py-4 sm:px-6 sm:py-3 rounded-xl sm:rounded-lg font-bold uppercase text-base sm:text-sm hover:opacity-90 transition-all shadow-md w-fit active:scale-95"
                        style={{
                            backgroundColor: promotion.buttonColor || '#ffffff',
                            color: promotion.buttonTextColor || '#fe0090'
                        }}
                    >
                        {promotion.buttonText || 'Je fonce'}
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Offers Section Component
// ============================================================================

export function OffersSection() {
    const { data: promotions, loading, error, refetch } = useFetch<Promotion[]>(
        () => promotionsService.getActive()
    );

    return (
        <section className="py-10 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-[#3f4c53] mb-10 md:mb-8">
                    Les offres du moment
                </h2>

                <Carousel
                    items={promotions || []}
                    renderItem={(promotion) => <PromotionCard promotion={promotion} />}
                    loading={loading}
                    error={error}
                    onRetry={refetch}
                    emptyMessage="Aucune offre disponible pour le moment"
                />
            </div>
        </section>
    );
}
