'use client';

import { Shield, Truck, HeartPulse, Lock, Star, Package } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export function TrustBar() {
    const features = [
        {
            icon: Shield,
            title: 'Pharmacie Diplômée',
            description: 'Agréée ARS',
        },
        {
            icon: Star,
            title: 'Avis clients',
            description: '4,8 / 5',
        },
        {
            icon: Truck,
            title: 'Livraison Offerte',
            description: 'dès 49€ d\'achats',
        },
        {
            icon: Package,
            title: '+ de 10 000 produits',
            description: 'Grandes marques',
        },
        {
            icon: HeartPulse,
            title: 'Conseil Pharmaceutique',
            description: 'Experts à votre écoute',
        },
        {
            icon: Lock,
            title: 'Paiement Sécurisé',
            description: '100% sécurisé',
        },
    ];

    // Group features into pairs for mobile
    const featurePairs = [];
    for (let i = 0; i < features.length; i += 2) {
        featurePairs.push(features.slice(i, i + 2));
    }

    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const scrollLeft = scrollRef.current.scrollLeft;
                const itemWidth = scrollRef.current.offsetWidth;
                const page = Math.round(scrollLeft / itemWidth);
                setCurrentPage(page);
            }
        };

        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="bg-white/30 backdrop-blur-sm border-y border-gray-100/50 py-8 md:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop: Grid layout */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center gap-2 group cursor-default"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center group-hover:bg-[#fe0090] transition-colors duration-300 shadow-sm">
                                    <Icon
                                        size={24}
                                        className="text-[#fe0090] group-hover:text-white transition-colors duration-300"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[#3f4c53] group-hover:text-[#fe0090] transition-colors leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile: Horizontal scroll with 2-item blocks */}
                <div className="md:hidden">
                    <div
                        ref={scrollRef}
                        className="flex gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {featurePairs.map((pair, pairIndex) => (
                            <div
                                key={pairIndex}
                                className="flex-shrink-0 w-full snap-start grid grid-cols-2 gap-6 px-2"
                            >
                                {pair.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center text-center gap-3"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                                                <Icon
                                                    size={28}
                                                    className="text-[#fe0090]"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-[#3f4c53] leading-tight">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {featurePairs.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollTo({
                                            left: index * scrollRef.current.offsetWidth,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${currentPage === index
                                        ? 'w-8 bg-[#fe0090]'
                                        : 'w-2 bg-gray-300'
                                    }`}
                                aria-label={`Page ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
