'use client';

import { ProductCard } from '@/components/molecules/ProductCard';
import { Carousel } from '@/components/organisms/Carousel';
import { Tag } from 'lucide-react';

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
    promotions?: {
        promotion: {
            id: string;
            name: string;
            discountType: string;
            discountValue: number;
        };
    }[];
}

interface PromotionsSectionProps {
    products: Product[];
}

export function PromotionsSection({ products }: PromotionsSectionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FE0090] flex items-center justify-center">
                        <Tag className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Promotions</h2>
                        <p className="text-xs md:text-sm text-gray-600">Profitez de nos meilleures offres</p>
                    </div>
                </div>
            </div>

            {products.length > 0 ? (
                <Carousel
                    items={products}
                    renderItem={(product) => (
                        <ProductCard
                            product={product as any}
                        />
                    )}
                    emptyMessage="Aucune promotion active"
                    itemClassName="w-64"
                />
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-600 text-sm font-medium">
                        Aucune promotion active
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Les produits en promotion apparaîtront ici
                    </p>
                </div>
            )}
        </div>
    );
}
