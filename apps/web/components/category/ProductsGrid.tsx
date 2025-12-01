import { ProductCard } from '@/components/molecules/ProductCard';
import { Package } from 'lucide-react';

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

interface ProductsGridProps {
    products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
                <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucun produit trouvé
                    </h3>
                    <p className="text-sm text-gray-600">
                        Essayez de modifier vos filtres pour trouver ce que vous cherchez.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product as any}
                />
            ))}
        </div>
    );
}
