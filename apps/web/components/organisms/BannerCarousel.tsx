'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';

interface Banner {
    id: string;
    title: string;
    alt: string;
    imageUrl: string;
    redirectUrl: string | null;
    text: string | null;
    textColor: string | null;
    showButton: boolean;
    buttonColor: string | null;
}

export function BannerCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Fetch banners
    useEffect(() => {
        fetch('/api/banners')
            .then((res) => res.json())
            .then((data) => setBanners(data))
            .catch((err) => console.error('Failed to load banners:', err));
    }, []);

    // Auto-play
    useEffect(() => {
        if (banners.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length, isPaused]);

    // Navigation handlers
    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();

        setTouchStart(0);
        setTouchEnd(0);
    };

    if (banners.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div
                className="relative w-full overflow-hidden group rounded-2xl shadow-lg"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Slides Container */}
                <div
                    className="flex transition-transform duration-500 ease-out h-[200px] md:h-[300px]"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {banners.map((banner) => (
                        <div key={banner.id} className="w-full flex-shrink-0 relative h-full">
                            <div className="relative w-full h-full">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.alt}
                                    fill
                                    className="object-cover"
                                    priority={currentIndex === 0}
                                />

                                {/* Overlay Content */}
                                {banner.text && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        {banner.showButton ? (
                                            <Link
                                                href={banner.redirectUrl || '#'}
                                                className="pointer-events-auto px-8 py-3 rounded-full font-bold text-white shadow-lg transform hover:scale-105 transition-transform"
                                                style={{ backgroundColor: banner.buttonColor || '#fe0090' }}
                                            >
                                                {banner.text}
                                            </Link>
                                        ) : (
                                            <h2
                                                className="text-2xl md:text-4xl font-bold drop-shadow-lg text-center px-4"
                                                style={{ color: banner.textColor || '#ffffff' }}
                                            >
                                                {banner.text}
                                            </h2>
                                        )}
                                    </div>
                                )}

                                {/* Full slide link if no button */}
                                {!banner.showButton && banner.redirectUrl && (
                                    <Link
                                        href={banner.redirectUrl}
                                        className="absolute inset-0 z-10"
                                        aria-label={banner.title}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows (Desktop) */}
                <div className="hidden md:block">
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#fe0090] p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#fe0090] p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Dots Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                ? 'bg-[#fe0090] w-6'
                                : 'bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
