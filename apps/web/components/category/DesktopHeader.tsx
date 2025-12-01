'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DesktopHeaderProps {
    categoryName: string;
    totalProducts: number;
    currentSort: string;
}

const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'newest', label: 'Nouveautés' },
    { value: 'promotions', label: 'Promotions' },
];

export function DesktopHeader({ categoryName, totalProducts, currentSort }: DesktopHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'relevance') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Pertinence';

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
                <p className="text-sm text-gray-600 mt-1">{totalProducts} produits</p>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Trier par :</span>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm min-w-[180px] justify-between"
                    >
                        <span>{currentSortLabel}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${currentSort === option.value
                                            ? 'bg-[#FE0090]/10 text-[#FE0090] font-semibold'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <span className="text-sm">{option.label}</span>
                                    {currentSort === option.value && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
