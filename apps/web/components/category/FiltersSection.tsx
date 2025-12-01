'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface Brand {
    id: string;
    name: string;
}

interface CurrentFilters {
    minPrice?: string;
    maxPrice?: string;
    brands: string[];
    inStock: boolean;
}

interface FiltersSectionProps {
    brands: Brand[];
    currentFilters: CurrentFilters;
}

export function FiltersSection({ brands, currentFilters }: FiltersSectionProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState({
        min: currentFilters.minPrice ? parseFloat(currentFilters.minPrice) : '',
        max: currentFilters.maxPrice ? parseFloat(currentFilters.maxPrice) : '',
    });

    const updateFilters = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const toggleBrand = (brandId: string) => {
        const currentBrands = currentFilters.brands;
        const newBrands = currentBrands.includes(brandId)
            ? currentBrands.filter(id => id !== brandId)
            : [...currentBrands, brandId];

        updateFilters('brands', newBrands.length > 0 ? newBrands.join(',') : null);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);

        if (priceRange.min) {
            params.set('minPrice', priceRange.min.toString());
        } else {
            params.delete('minPrice');
        }

        if (priceRange.max) {
            params.set('maxPrice', priceRange.max.toString());
        } else {
            params.delete('maxPrice');
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push(pathname);
    };

    const hasActiveFilters = currentFilters.minPrice || currentFilters.maxPrice ||
        currentFilters.brands.length > 0 || currentFilters.inStock;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                    <h2 className="font-semibold text-gray-900 text-sm">Filtres</h2>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-xs text-[#FE0090] hover:text-[#d4007a] font-medium flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        Effacer
                    </button>
                )}
            </div>

            <div className="p-4 space-y-6">
                {/* Price Filter */}
                <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-3">Prix</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                placeholder="Min"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FE0090] focus:border-[#FE0090]"
                            />
                            <input
                                type="number"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                placeholder="Max"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FE0090] focus:border-[#FE0090]"
                            />
                        </div>
                        <button
                            onClick={applyPriceFilter}
                            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>

                {/* Brands Filter */}
                {brands.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-900 text-sm mb-3">Marques</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {brands.map((brand) => (
                                <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={currentFilters.brands.includes(brand.id)}
                                        onChange={() => toggleBrand(brand.id)}
                                        className="w-4 h-4 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090] cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                        {brand.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stock Filter */}
                <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-3">Disponibilité</h3>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={currentFilters.inStock}
                            onChange={(e) => updateFilters('inStock', e.target.checked ? 'true' : null)}
                            className="w-4 h-4 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            En stock uniquement
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}
