'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        sku: string | null;
        imageUrl: string | null;
    };
}

interface OrderItemsTableProps {
    items: OrderItem[];
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-[#3f4c53]">Articles ({items.length})</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qté</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product.imageUrl ? (
                                                <Image
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-400 m-auto" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            {item.product.sku && (
                                                <p className="text-xs text-gray-500">Réf: {item.product.sku}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {Number(item.price).toFixed(2)} €
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {(Number(item.price) * item.quantity).toFixed(2)} €
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
