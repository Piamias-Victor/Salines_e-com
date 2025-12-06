'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface CurrentFilters {
    minPrice?: string;
    maxPrice?: string;
    categories: string[];
    inStock: boolean;
    onlyPromo: boolean;
}

interface BrandFiltersSidebarProps {
    categories: Category[];
    currentFilters: CurrentFilters;
}

export function BrandFiltersSidebar({ categories, currentFilters }: BrandFiltersSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState({
        min: currentFilters.minPrice || '',
        max: currentFilters.maxPrice || '',
    });

    const [openSections, setOpenSections] = useState({
        price: true,
        categories: true,
        stock: true,
        promo: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections({ ...openSections, [section]: !openSections[section] });
    };

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const toggleCategory = (categoryId: string) => {
        const currentCategories = currentFilters.categories;
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter(id => id !== categoryId)
            : [...currentCategories, categoryId];

        updateFilter('categories', newCategories.length > 0 ? newCategories.join(',') : null);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);

        if (priceRange.min) {
            params.set('minPrice', priceRange.min);
        } else {
            params.delete('minPrice');
        }

        if (priceRange.max) {
            params.set('maxPrice', priceRange.max);
        } else {
            params.delete('maxPrice');
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filtres</h2>

            {/* Price Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between mb-3"
                >
                    <h3 className="font-semibold text-gray-900">Prix</h3>
                    {openSections.price ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>
                {openSections.price && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                placeholder="Min"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FE0090]"
                            />
                            <input
                                type="number"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                placeholder="Max"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FE0090]"
                            />
                        </div>
                        <button
                            onClick={applyPriceFilter}
                            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            Appliquer
                        </button>
                    </div>
                )}
            </div>

            {/* Categories Filter */}
            {categories.length > 0 && (
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                        onClick={() => toggleSection('categories')}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <h3 className="font-semibold text-gray-900">Catégories</h3>
                        {openSections.categories ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </button>
                    {openSections.categories && (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {categories.map((category) => (
                                <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={currentFilters.categories.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                        className="w-4 h-4 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090] cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                        {category.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Stock Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                    onClick={() => toggleSection('stock')}
                    className="w-full flex items-center justify-between mb-3"
                >
                    <h3 className="font-semibold text-gray-900">Disponibilité</h3>
                    {openSections.stock ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>
                {openSections.stock && (
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={currentFilters.inStock}
                            onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
                            className="w-4 h-4 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            En stock uniquement
                        </span>
                    </label>
                )}
            </div>

            {/* Promotions Filter */}
            <div>
                <button
                    onClick={() => toggleSection('promo')}
                    className="w-full flex items-center justify-between mb-3"
                >
                    <h3 className="font-semibold text-gray-900">Promotions</h3>
                    {openSections.promo ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>
                {openSections.promo && (
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={currentFilters.onlyPromo}
                            onChange={(e) => updateFilter('onlyPromo', e.target.checked ? 'true' : null)}
                            className="w-4 h-4 text-[#FE0090] border-gray-300 rounded focus:ring-[#FE0090] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            Produits en promotion uniquement
                        </span>
                    </label>
                )}
            </div>
        </div>
    );
}
