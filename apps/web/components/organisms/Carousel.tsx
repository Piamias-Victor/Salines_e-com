'use client';

import { ReactNode } from 'react';
import { useCarousel } from '@/lib/hooks';
import { CarouselNavigation } from '@/components/molecules/CarouselNavigation';
import { LoadingContainer } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { EmptyState } from '@/components/atoms/EmptyState';
import { cn } from '@/lib/utils';

// ============================================================================
// Generic Carousel Component
// ============================================================================

interface CarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    onRetry?: () => void;
    className?: string;
    containerClassName?: string;
    itemClassName?: string;
    showNavigation?: boolean;
    autoScroll?: boolean;
}

export function Carousel<T extends { id: string }>({
    items,
    renderItem,
    loading = false,
    error = null,
    emptyMessage = 'Aucun élément à afficher',
    onRetry,
    className,
    containerClassName,
    itemClassName,
    showNavigation = true,
    autoScroll = false,
}: CarouselProps<T>) {
    const { scrollRef, scroll, canScrollLeft, canScrollRight } = useCarousel({
        autoScroll,
    });

    // Loading state
    if (loading) {
        return <LoadingContainer className={className} />;
    }

    // Error state
    if (error) {
        return <ErrorMessage message={error} onRetry={onRetry} className={className} />;
    }

    // Empty state
    if (items.length === 0) {
        return <EmptyState message={emptyMessage} className={className} />;
    }

    return (
        <div className={cn('relative', containerClassName)}>
            {/* Navigation Arrows */}
            {showNavigation && items.length > 3 && (
                <CarouselNavigation
                    onPrevious={() => scroll('left')}
                    onNext={() => scroll('right')}
                    canScrollLeft={canScrollLeft}
                    canScrollRight={canScrollRight}
                />
            )}

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className={cn(
                    'flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4',
                    className
                )}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={cn('flex-shrink-0 snap-start', itemClassName)}
                    >
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>
        </div>
    );
}
