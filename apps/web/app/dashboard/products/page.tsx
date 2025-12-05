"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { ProductsTable } from "@/components/dashboard/products/ProductsTable";

export default function ProductsPage() {
    const { products, loading, deleteProduct } = useProducts();
    const [searchQuery, setSearchQuery] = useState("");

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
            return;
        }

        const success = await deleteProduct(id);
        if (!success) {
            alert("Erreur lors de la suppression du produit");
        }
    };

    const filteredProducts = searchQuery
        ? products.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.ean.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

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

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Rechercher un produit (nom, EAN...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                    />
                </div>
            </div>

            {/* Products Table */}
            <ProductsTable
                products={filteredProducts}
                loading={loading}
                onDelete={handleDelete}
            />
        </div>
    );
}
