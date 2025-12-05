'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Search, Loader2, ChevronRight, Package } from 'lucide-react';
import { categoriesService, brandsService, searchService } from '@/lib/services';
import type { Category, Brand, Product } from '@/lib/types';

interface SearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<{ brands: Brand[], categories: Category[], products: Product[] }>({ brands: [], categories: [], products: [] });
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Default Content State
    const [defaultCategories, setDefaultCategories] = useState<Category[]>([]);
    const [defaultBrands, setDefaultBrands] = useState<Brand[]>([]);

    // Fetch default content once on mount
    useEffect(() => {
        const fetchDefaults = async () => {
            try {
                const [cats, brands] = await Promise.all([
                    categoriesService.getSearch(),
                    brandsService.getSearch()
                ]);
                setDefaultCategories(cats);
                setDefaultBrands(brands);
            } catch (error) {
                console.error('Error fetching default content:', error);
            }
        };
        fetchDefaults();
    }, []); // Empty dependency array - only run once

    // Debounce search query
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults({ brands: [], categories: [], products: [] });
                setHasSearched(false);
                return;
            }

            setLoading(true);
            try {
                const data = await searchService.searchGlobal(debouncedQuery);
                setResults(data);
                setHasSearched(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const showResults = hasSearched && (results.brands.length > 0 || results.categories.length > 0 || results.products.length > 0);
    const showEmpty = hasSearched && !loading && !showResults;
    const showDefaults = !hasSearched && !loading && searchQuery.length < 2;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute top-0 left-0 right-0 bg-white shadow-xl transform transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto rounded-b-3xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header with Search Input */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                type="text"
                                placeholder="Rechercher un produit, une marque, une catégorie..."
                                className="w-full pl-12 pr-4 py-4 text-lg bg-gray-50 border-2 border-transparent focus:border-[#fe0090] rounded-2xl outline-none transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            {loading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 className="animate-spin text-[#fe0090]" size={24} />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Default Content (Suggestions) */}
                    {showDefaults && (
                        <>
                            {(defaultCategories.length > 0 || defaultBrands.length > 0) ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    {/* Brands First on Mobile */}
                                    {defaultBrands.length > 0 && (
                                        <div className="lg:col-span-5 order-1 lg:order-2 mb-8 lg:mb-0">
                                            <h3 className="text-xl font-bold text-[#3f4c53] mb-6 flex items-center gap-2">
                                                Marques à la une
                                            </h3>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4">
                                                {defaultBrands.map((brand) => (
                                                    <Link
                                                        key={brand.id}
                                                        href={`/brand/${brand.slug}`}
                                                        onClick={onClose}
                                                        className="aspect-square relative bg-white rounded-xl border border-gray-100 hover:border-[#fe0090] shadow-sm hover:shadow-md transition-all flex items-center justify-center p-4 group"
                                                    >
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={brand.imageUrl || '/placeholder.png'}
                                                                alt={brand.name}
                                                                fill
                                                                className="object-contain transition-transform duration-300 group-hover:scale-110"
                                                            />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Categories */}
                                    {defaultCategories.length > 0 && (
                                        <div className={defaultBrands.length > 0 ? "lg:col-span-7 order-2 lg:order-1" : "lg:col-span-12"}>
                                            <h3 className="text-xl font-bold text-[#3f4c53] mb-6 flex items-center gap-2">
                                                Catégories populaires
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {defaultCategories.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`/category/${category.slug}`}
                                                        onClick={onClose}
                                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-pink-50 group transition-colors border border-gray-100 hover:border-pink-100"
                                                    >
                                                        <span className="font-medium text-gray-700 group-hover:text-[#fe0090] transition-colors">
                                                            {category.name}
                                                        </span>
                                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#fe0090] transition-colors" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="text-gray-400" size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Commencez votre recherche</h3>
                                    <p className="text-gray-500">Tapez un mot-clé pour rechercher des produits, marques ou catégories</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Search Results Content Grid */}
                    {showResults && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                            {/* Left Column (1/3): Brands & Categories */}
                            <div className="lg:col-span-1 space-y-8">

                                {/* Brands Section */}
                                {results.brands.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-[#3f4c53] mb-4 flex items-center gap-2">
                                            Marques
                                            <span className="text-sm font-normal text-gray-400">({results.brands.length})</span>
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {results.brands.map((brand) => (
                                                <Link
                                                    key={brand.id}
                                                    href={`/brand/${brand.slug}`}
                                                    onClick={onClose}
                                                    className="aspect-square relative bg-white rounded-xl border border-gray-100 hover:border-[#fe0090] shadow-sm hover:shadow-md transition-all flex items-center justify-center p-2 group"
                                                >
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={brand.imageUrl || '/placeholder.png'}
                                                            alt={brand.name}
                                                            fill
                                                            className="object-contain transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Categories Section */}
                                {results.categories.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-[#3f4c53] mb-4 flex items-center gap-2">
                                            Catégories
                                            <span className="text-sm font-normal text-gray-400">({results.categories.length})</span>
                                        </h3>
                                        <div className="space-y-2">
                                            {results.categories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/category/${category.slug}`}
                                                    onClick={onClose}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 group transition-colors border border-gray-100 hover:border-pink-100"
                                                >
                                                    <span className="font-medium text-gray-700 group-hover:text-[#fe0090] transition-colors">
                                                        {category.name}
                                                    </span>
                                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#fe0090] transition-colors" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column (2/3): Products */}
                            <div className="lg:col-span-2">
                                {results.products.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-[#3f4c53] mb-4 flex items-center gap-2">
                                            Produits
                                            <span className="text-sm font-normal text-gray-400">({results.products.length})</span>
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                                            {results.products.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.slug}`}
                                                    onClick={onClose}
                                                    className="group bg-white rounded-xl border border-gray-100 hover:border-[#fe0090] p-4 transition-all hover:shadow-lg flex flex-col h-full"
                                                >
                                                    <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={product.images?.[0]?.url || product.imageUrl || '/placeholder.png'}
                                                            alt={product.name}
                                                            fill
                                                            className="object-contain mix-blend-multiply p-2 transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">
                                                            {/* We don't have brand name directly on product type usually, need to check if included */}
                                                            {(product as any).brands?.[0]?.brand?.name || (product as any).brand?.name || 'Marque'}
                                                        </p>
                                                        <h4 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-[#fe0090] transition-colors text-sm">
                                                            {product.name}
                                                        </h4>
                                                    </div>
                                                    <div className="mt-auto pt-2 border-t border-gray-50">
                                                        <p className="font-bold text-[#fe0090]">
                                                            {Number(product.priceTTC).toFixed(2)} €
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {showEmpty && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                            <p className="text-gray-500">Essayez avec d'autres mots-clés</p>
                        </div>
                    )}

                    {!hasSearched && !loading && searchQuery.length >= 2 && (
                        <div className="text-center py-12 text-gray-400">
                            Commencez à taper pour rechercher...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
