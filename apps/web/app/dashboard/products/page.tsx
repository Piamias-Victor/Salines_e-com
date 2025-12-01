"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    ean: string;
    imageUrl: string | null;
    priceTTC: number;
    stock: number;
    isActive: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products?admin=true");
            const data = await response.json();
            setProducts(data.data || data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            // Remove from list
            setProducts(products.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Erreur lors de la suppression du produit");
        }
    };

    if (loading) {
        return <div className="text-center py-12">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3f4c53]">Produits</h1>
                    <p className="text-gray-500">
                        Gérez votre catalogue de produits ({products.length})
                    </p>
                </div>
                <Link
                    href="/dashboard/products/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Ajouter un produit
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Rechercher un produit (nom, EAN...)"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                    />
                </div>
            </div>

            {/* Products Table */}
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
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 10
                                                    ? "bg-green-100 text-green-800"
                                                    : product.stock > 0
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {product.stock} en stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {product.isActive ? "Actif" : "Inactif"}
                                            </span>
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
                                                    onClick={() => handleDelete(product.id, product.name)}
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
        </div>
    );
}
