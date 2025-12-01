'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';

interface Brand {
    id: string;
    name: string;
}

interface CurrentFilters {
    minPrice?: string;
    maxPrice?: string;
    brands: string[];
    inStock: boolean;
    onlyPromo: boolean;
}

interface MobileHeaderProps {
    categoryName: string;
    totalProducts: number;
    currentSort: string;
    activeFiltersCount: number;
    brands: Brand[];
    currentFilters: CurrentFilters;
}

const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'newest', label: 'Nouveautés' },
    { value: 'promotions', label: 'Promotions' },
];

export function MobileHeader({
    categoryName,
    totalProducts,
    currentSort,
    activeFiltersCount,
    brands,
    currentFilters,
}: MobileHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [tempFilters, setTempFilters] = useState(currentFilters);

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'relevance') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        setShowSortMenu(false);
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);

        // Price
        if (tempFilters.minPrice) {
            params.set('minPrice', tempFilters.minPrice);
        } else {
            params.delete('minPrice');
        }
        if (tempFilters.maxPrice) {
            params.set('maxPrice', tempFilters.maxPrice);
        } else {
            params.delete('maxPrice');
        }

        // Brands
        if (tempFilters.brands.length > 0) {
            params.set('brands', tempFilters.brands.join(','));
        } else {
            params.delete('brands');
        }

        // Stock
        if (tempFilters.inStock) {
            params.set('inStock', 'true');
        } else {
            params.delete('inStock');
        }

        // Promo
        if (tempFilters.onlyPromo) {
            params.set('onlyPromo', 'true');
        } else {
            params.delete('onlyPromo');
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        setShowFilters(false);
    };

    const resetFilters = () => {
        setTempFilters({
            minPrice: '',
            maxPrice: '',
            brands: [],
            inStock: false,
            onlyPromo: false,
        });
    };

    const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Pertinence';

    return (
        <>
            {/* Top Header - Category Info Only */}
            <div className="px-4 py-4">
                <h1 className="text-xl font-bold text-gray-900">{categoryName}</h1>
                <p className="text-sm text-gray-600">{totalProducts} produits</p>
            </div>

            {/* Bottom Sticky Bar - Filter & Sort Buttons */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg px-4 py-3 safe-area-bottom">
                <div className="flex gap-3">
                    {/* Filter Button - White */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-all relative font-semibold"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        <span>Filtrer</span>
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FE0090] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Sort Button - Pink */}
                    <button
                        onClick={() => setShowSortMenu(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FE0090] text-white rounded-lg hover:bg-[#d4007a] transition-all font-semibold"
                    >
                        <span>{currentSortLabel}</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Sort Menu Drawer - Slide from bottom */}
            {showSortMenu && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
                        onClick={() => setShowSortMenu(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slideUp">
                        <div className="px-4 py-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Trier par</h3>
                                <button
                                    onClick={() => setShowSortMenu(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${currentSort === option.value
                                                ? 'bg-[#FE0090]/10 text-[#FE0090] font-semibold'
                                                : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {currentSort === option.value && (
                                            <Check className="w-5 h-5" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-safe-area-inset-bottom bg-white" />
                    </div>
                </>
            )}

            {/* Filters Drawer - Slide from bottom */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="fixed inset-x-0 bottom-0 top-20 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col animate-slideUp">
                        {/* Header */}
                        <div className="flex-shrink-0 px-4 py-4 border-b flex items-center justify-between">
                            <h2 className="text-lg font-bold">Filtres</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filters Content */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                            {/* Price Filter */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Prix</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        value={tempFilters.minPrice || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, minPrice: e.target.value })}
                                        placeholder="Min"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FE0090] focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        value={tempFilters.maxPrice || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
                                        placeholder="Max"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FE0090] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Brands Filter */}
                            {brands.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Marques</h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {brands.map((brand) => (
                                            <label key={brand.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={tempFilters.brands.includes(brand.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTempFilters({
                                                                ...tempFilters,
                                                                brands: [...tempFilters.brands, brand.id],
                                                            });
                                                        } else {
                                                            setTempFilters({
                                                                ...tempFilters,
                                                                brands: tempFilters.brands.filter(id => id !== brand.id),
                                                            });
                                                        }
                                                    }}
                                                    className="w-5 h-5 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090]"
                                                />
                                                <span className="text-sm text-gray-700 font-medium">{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stock Filter */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Disponibilité</h3>
                                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={tempFilters.inStock}
                                        onChange={(e) => setTempFilters({ ...tempFilters, inStock: e.target.checked })}
                                        className="w-5 h-5 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090]"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">En stock uniquement</span>
                                </label>
                            </div>

                            {/* Promotions Filter */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Promotions</h3>
                                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={tempFilters.onlyPromo}
                                        onChange={(e) => setTempFilters({ ...tempFilters, onlyPromo: e.target.checked })}
                                        className="w-5 h-5 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090]"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Produits en promotion uniquement</span>
                                </label>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex-shrink-0 bg-white border-t px-4 py-4 flex gap-3">
                            <button
                                onClick={resetFilters}
                                className="flex-1 px-4 py-3 border-2 border-gray-900 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                            >
                                Réinitialiser
                            </button>
                            <button
                                onClick={applyFilters}
                                className="flex-1 px-4 py-3 bg-[#FE0090] text-white rounded-lg font-semibold text-sm hover:bg-[#d4007a] transition-colors shadow-lg"
                            >
                                Appliquer
                            </button>
                        </div>
                        <div className="h-safe-area-inset-bottom bg-white" />
                    </div>
                </>
            )}

            <style jsx global>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </>
    );
}
