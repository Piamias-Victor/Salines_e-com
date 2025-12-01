'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Carousel } from '@/components/organisms/Carousel';
import { ChevronRight } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    priceTTC: number;
    stock: number;
    maxOrderQuantity: number | null;
    brands?: { brand: { name: string } }[];
    images?: { url: string }[];
}

interface CategoryProductsSectionProps {
    categoryName: string;
    categorySlug: string;
    products: Product[];
}

export function CategoryProductsSection({ categoryName, categorySlug, products }: CategoryProductsSectionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Produits {categoryName}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Découvrez notre sélection
                    </p>
                </div>
                <Link
                    href={`/category/${categorySlug}/all`}
                    className="flex items-center gap-2 text-[#FE0090] font-semibold text-xs md:text-sm hover:gap-3 transition-all"
                >
                    <span className="hidden sm:inline">Voir tous les produits</span>
                    <span className="sm:hidden">Tout voir</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {products.length > 0 ? (
                <Carousel
                    items={products}
                    renderItem={(product) => <ProductCard product={product as any} />}
                    emptyMessage="Aucun produit disponible pour le moment"
                    itemClassName="w-64"
                />
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm">
                        Aucun produit disponible pour le moment
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                        Cette section affichera les produits de la catégorie principale
                    </p>
                </div>
            )}
        </div>
    );
}
