import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Carousel Navigation Component
// ============================================================================

interface CarouselNavigationProps {
    onPrevious: () => void;
    onNext: () => void;
    canScrollLeft?: boolean;
    canScrollRight?: boolean;
    className?: string;
}

export function CarouselNavigation({
    onPrevious,
    onNext,
    canScrollLeft = true,
    canScrollRight = true,
    className,
}: CarouselNavigationProps) {
    const buttonClasses = 'w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-[#3f4c53] hover:text-[#fe0090] transition-all disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <>
            {/* Left Arrow */}
            <button
                onClick={onPrevious}
                disabled={!canScrollLeft}
                className={cn(
                    buttonClasses,
                    'absolute -left-5 top-1/2 -translate-y-1/2 z-10',
                    className
                )}
                aria-label="Précédent"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button
                onClick={onNext}
                disabled={!canScrollRight}
                className={cn(
                    buttonClasses,
                    'absolute -right-5 top-1/2 -translate-y-1/2 z-10',
                    className
                )}
                aria-label="Suivant"
            >
                <ChevronRight size={24} />
            </button>
        </>
    );
}
