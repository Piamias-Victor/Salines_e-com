'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface Brand {
    id: string;
    name: string;
}

interface ActiveFiltersProps {
    filters: {
        minPrice?: string;
        maxPrice?: string;
        brands: string[];
        inStock: boolean;
        onlyPromo: boolean;
    };
    brandsList: Brand[];
}

export function ActiveFilters({ filters, brandsList }: ActiveFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const removeFilter = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams);

        if (key === 'brands' && value) {
            const currentBrands = filters.brands.filter(id => id !== value);
            if (currentBrands.length > 0) {
                params.set('brands', currentBrands.join(','));
            } else {
                params.delete('brands');
            }
        } else if (key === 'price') {
            params.delete('minPrice');
            params.delete('maxPrice');
        } else {
            params.delete(key);
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('brands');
        params.delete('inStock');
        params.delete('onlyPromo');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasFilters = filters.minPrice || filters.maxPrice || filters.brands.length > 0 ||
        filters.inStock || filters.onlyPromo;

    if (!hasFilters) return null;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Filtres actifs</h3>
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#FE0090] hover:text-[#d4007a] font-medium"
                >
                    Tout effacer
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {/* Price Filter */}
                {(filters.minPrice || filters.maxPrice) && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                        <span>
                            Prix: {filters.minPrice || '0'}€ - {filters.maxPrice || '∞'}€
                        </span>
                        <button
                            onClick={() => removeFilter('price')}
                            className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Brand Filters */}
                {filters.brands.map((brandId) => {
                    const brand = brandsList.find(b => b.id === brandId);
                    if (!brand) return null;
                    return (
                        <div key={brandId} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                            <span>{brand.name}</span>
                            <button
                                onClick={() => removeFilter('brands', brandId)}
                                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}

                {/* Stock Filter */}
                {filters.inStock && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                        <span>En stock</span>
                        <button
                            onClick={() => removeFilter('inStock')}
                            className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Promo Filter */}
                {filters.onlyPromo && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                        <span>Promotions</span>
                        <button
                            onClick={() => removeFilter('onlyPromo')}
                            className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
