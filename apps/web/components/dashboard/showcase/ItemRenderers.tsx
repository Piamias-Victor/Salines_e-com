import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { Category, Brand, FeaturedProduct } from '@/lib/types/showcase';

export function renderCategoryContent(item: Category) {
    return (
        <div className="flex items-center gap-3">
            {item.imageUrl ? (
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                />
            ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-400" />
                </div>
            )}
            <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">Catégorie</p>
            </div>
        </div>
    );
}

export function renderBrandContent(item: Brand) {
    return (
        <div className="flex items-center gap-3">
            {item.imageUrl ? (
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                />
            ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-400" />
                </div>
            )}
            <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">Marque</p>
            </div>
        </div>
    );
}

export function renderProductContent(item: FeaturedProduct) {
    const imageUrl = item.product.images?.[0]?.url || item.product.imageUrl;

    return (
        <div className="flex items-center gap-3">
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={item.product.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                />
            ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-400" />
                </div>
            )}
            <div>
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                    {item.product.priceTTC.toFixed(2)} €
                </p>
            </div>
        </div>
    );
}
