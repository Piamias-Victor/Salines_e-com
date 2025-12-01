'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { UI_CONFIG } from '@/lib/constants';

// ============================================================================
// useCarousel Hook
// ============================================================================

interface UseCarouselOptions {
    scrollAmount?: number;
    autoScroll?: boolean;
    autoScrollInterval?: number;
}

interface UseCarouselReturn {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    scroll: (direction: 'left' | 'right') => void;
    canScrollLeft: boolean;
    canScrollRight: boolean;
    scrollToStart: () => void;
    scrollToEnd: () => void;
}

export function useCarousel(options: UseCarouselOptions = {}): UseCarouselReturn {
    const {
        scrollAmount = UI_CONFIG.CAROUSEL.SCROLL_AMOUNT,
        autoScroll = false,
        autoScrollInterval = UI_CONFIG.CAROUSEL.AUTO_SCROLL_INTERVAL,
    } = options;

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(true);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Check scroll position
    const checkScrollPosition = useCallback(() => {
        const element = scrollRef.current;
        if (!element) return;

        setCanScrollLeft(element.scrollLeft > 0);
        setCanScrollRight(
            element.scrollLeft < element.scrollWidth - element.clientWidth - 1
        );
    }, []);

    // Scroll function
    const scroll = useCallback(
        (direction: 'left' | 'right') => {
            if (!scrollRef.current) return;

            const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount;
            scrollRef.current.scrollBy({
                left: scrollValue,
                behavior: 'smooth',
            });
        },
        [scrollAmount]
    );

    // Scroll to start
    const scrollToStart = useCallback(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }, []);

    // Scroll to end
    const scrollToEnd = useCallback(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({
            left: scrollRef.current.scrollWidth,
            behavior: 'smooth',
        });
    }, []);

    // Auto-scroll effect
    useEffect(() => {
        if (!autoScroll) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;

                if (isAtEnd) {
                    scrollToStart();
                } else {
                    scroll('right');
                }
            }
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [autoScroll, autoScrollInterval, scroll, scrollToStart]);

    // Listen to scroll events
    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        checkScrollPosition();
        element.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);

        return () => {
            element.removeEventListener('scroll', checkScrollPosition);
            window.removeEventListener('resize', checkScrollPosition);
        };
    }, [checkScrollPosition]);

    return {
        scrollRef,
        scroll,
        canScrollLeft,
        canScrollRight,
        scrollToStart,
        scrollToEnd,
    };
}
