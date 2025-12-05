'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui';

interface Product {
    id: string;
    name: string;
    ean: string;
    imageUrl: string | null;
    priceTTC: number;
    stock: number;
    isActive: boolean;
}

interface ProductsTableProps {
    products: Product[];
    loading: boolean;
    onDelete: (id: string, name: string) => void;
}

export function ProductsTable({ products, loading, onDelete }: ProductsTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-12 text-center text-gray-500">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Produit
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                EAN
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Prix
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    Aucun produit trouvé. Commencez par en ajouter un !
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                {product.imageUrl ? (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#3f4c53] line-clamp-1">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Ref: {product.id.slice(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                        {product.ean}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#3f4c53]">
                                        {new Intl.NumberFormat("fr-FR", {
                                            style: "currency",
                                            currency: "EUR",
                                        }).format(product.priceTTC)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                product.stock > 10
                                                    ? "success"
                                                    : product.stock > 0
                                                        ? "warning"
                                                        : "error"
                                            }
                                        >
                                            {product.stock} en stock
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={product.isActive ? "info" : "neutral"}>
                                            {product.isActive ? "Actif" : "Inactif"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/products/${product.id}`}
                                                className="p-2 text-gray-400 hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => onDelete(product.id, product.name)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
