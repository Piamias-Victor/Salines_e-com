'use client';

import { ProductCard } from '@/components/molecules/ProductCard';
import { Carousel } from '@/components/organisms/Carousel';
import { Sparkles } from 'lucide-react';

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
    createdAt: Date;
}

interface NewProductsSectionProps {
    products: Product[];
}

export function NewProductsSection({ products }: NewProductsSectionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Nouveautés</h2>
                        <p className="text-xs md:text-sm text-gray-600">Découvrez nos derniers produits</p>
                    </div>
                </div>
            </div>

            {products.length > 0 ? (
                <Carousel
                    items={products}
                    renderItem={(product) => <ProductCard product={product as any} />}
                    emptyMessage="Aucune nouveauté pour le moment"
                    itemClassName="w-64"
                />
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-600 text-sm font-medium">
                        Aucune nouveauté pour le moment
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Les produits ajoutés dans les 30 derniers jours apparaîtront ici
                    </p>
                </div>
            )}
        </div>
    );
}
