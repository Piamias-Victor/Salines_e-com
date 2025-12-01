'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Plus, X, Loader2, Package } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    imageUrl: string | null;
    priceTTC: number;
    ean: string;
}

interface ProductPickerProps {
    selectedProductIds: string[];
    onChange: (ids: string[]) => void;
}

export function ProductPicker({ selectedProductIds, onChange }: ProductPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Fetch details of already selected products on mount
    useEffect(() => {
        const fetchSelectedProducts = async () => {
            if (selectedProductIds.length === 0) {
                setInitialLoading(false);
                return;
            }

            try {
                // We need an endpoint to fetch multiple products by ID, or we can just fetch all and filter client side if not too many
                // For now, let's assume we can fetch them. Since we don't have a bulk fetch by ID, we might need to rely on the parent passing the full objects
                // OR we update the API.
                // Let's try to fetch with a large limit and filter client side for now, or implement a specific route.
                // Actually, the best way is to have the parent pass the initial products, but the interface only has IDs.
                // Let's implement a search that finds these specific IDs.
                // A better approach for now: The parent form should probably pass the full product objects if available, 
                // but standard practice is IDs.
                // Let's just fetch the first page of products for the "browse" list and search for specific ones.

                // Temporary: fetch all products (admin mode) to find the selected ones. 
                // In a real app with thousands of products, we'd need a `ids=1,2,3` param.
                const res = await fetch('/api/products?limit=100&admin=true');
                const data = await res.json();
                const found = data.data.filter((p: Product) => selectedProductIds.includes(p.id));
                setSelectedProducts(found);
            } catch (error) {
                console.error('Error fetching selected products:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchSelectedProducts();
    }, []); // Run once on mount

    // Search products
    useEffect(() => {
        const searchProducts = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5&admin=true`);
                const data = await res.json();
                // Filter out already selected products from results
                setSearchResults(data.data.filter((p: Product) => !selectedProductIds.includes(p.id)));
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, selectedProductIds]);

    const handleAdd = (product: Product) => {
        const newIds = [...selectedProductIds, product.id];
        onChange(newIds);
        setSelectedProducts([...selectedProducts, product]);
        setSearchQuery(''); // Clear search to reset
    };

    const handleRemove = (productId: string) => {
        const newIds = selectedProductIds.filter(id => id !== productId);
        onChange(newIds);
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    if (initialLoading) {
        return <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="animate-spin" size={16} /> Chargement des produits...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher un produit par nom ou EAN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="animate-spin text-gray-400" size={16} />
                    </div>
                )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleAdd(product)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                        >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                {product.imageUrl ? (
                                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-gray-500">EAN: {product.ean}</p>
                            </div>
                            <Plus size={18} className="text-[#fe0090]" />
                        </button>
                    ))}
                </div>
            )}

            {/* Selected Products List */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Produits sélectionnés ({selectedProducts.length})
                </h4>

                {selectedProducts.length === 0 ? (
                    <div className="text-sm text-gray-400 italic p-4 bg-gray-50 rounded-lg text-center border border-dashed border-gray-200">
                        Aucun produit associé à cette catégorie
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
                        {selectedProducts.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg group hover:border-[#fe0090]/30 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(product.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
