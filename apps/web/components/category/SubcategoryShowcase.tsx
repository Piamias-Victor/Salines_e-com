'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Carousel } from '@/components/organisms/Carousel';
import { ChevronRight, ImageIcon } from 'lucide-react';

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
}

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

interface SubcategoryShowcaseProps {
    subcategory: Subcategory;
    products: Product[];
    reversed?: boolean;
}

export function SubcategoryShowcase({ subcategory, products, reversed = false }: SubcategoryShowcaseProps) {
    const displayProducts = products.slice(0, 4);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 ${reversed ? 'lg:flex-row-reverse' : ''}`}>
                {/* Category Card */}
                <div className={`lg:col-span-3 ${reversed ? 'lg:col-start-10' : ''}`}>
                    <Link
                        href={`/category/${subcategory.slug}`}
                        className="group block"
                    >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4">
                            {subcategory.imageUrl ? (
                                <Image
                                    src={subcategory.imageUrl}
                                    alt={subcategory.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FE0090] transition-colors">
                            {subcategory.name}
                        </h3>
                        {subcategory.description && (
                            <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-3">
                                {subcategory.description}
                            </p>
                        )}
                        <div className="flex items-center gap-2 text-[#FE0090] font-semibold text-xs md:text-sm group-hover:gap-3 transition-all">
                            <span>Voir tous les produits</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Products Carousel */}
                <div className={`lg:col-span-9 ${reversed ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    {displayProducts.length > 0 ? (
                        <Carousel
                            items={displayProducts}
                            renderItem={(product) => <ProductCard product={product as any} />}
                            emptyMessage="Aucun produit disponible"
                            itemClassName="w-64"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p className="text-sm">Aucun produit disponible</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
