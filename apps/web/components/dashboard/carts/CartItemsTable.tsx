'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui';

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        priceTTC: number;
        priceHT: number;
        imageUrl: string | null;
        stock: number;
    };
}

interface CartItemsTableProps {
    items: CartItem[];
    subtotal: number;
}

export function CartItemsTable({ items, subtotal }: CartItemsTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-[#3f4c53]">
                    Produits ({items.length})
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Produit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Prix HT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Prix TTC
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Quantité
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Sous-total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Stock
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product.imageUrl ? (
                                                <Image
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="text-gray-400" size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                className="font-medium text-gray-900 hover:text-[#fe0090] line-clamp-2"
                                            >
                                                {item.product.name}
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {Number(item.product.priceHT).toFixed(2)} €
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {Number(item.product.priceTTC).toFixed(2)} €
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    ×{item.quantity}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    {(Number(item.product.priceTTC) * item.quantity).toFixed(2)} €
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={
                                            item.product.stock > 10
                                                ? 'success'
                                                : item.product.stock > 0
                                                    ? 'warning'
                                                    : 'error'
                                        }
                                    >
                                        {item.product.stock > 0 ? `${item.product.stock} en stock` : 'Rupture'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-right font-semibold text-gray-900">
                                Total
                            </td>
                            <td className="px-6 py-4 text-lg font-bold text-[#fe0090]">
                                {subtotal.toFixed(2)} €
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
