'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useBrands } from '@/hooks/useBrands';
import { BrandsTable } from '@/components/dashboard/brands/BrandsTable';

export default function BrandsPage() {
    const { brands, loading, deleteBrand } = useBrands();
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) return;

        const success = await deleteBrand(id);
        if (!success) {
            alert('Erreur lors de la suppression');
        }
    };

    const filteredBrands = searchQuery
        ? brands.filter((brand) =>
            brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : brands;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marques</h1>
                    <p className="text-sm text-gray-500">Gérez vos marques (création, modification, suppression)</p>
                </div>
                <Link
                    href="/dashboard/brands/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20"
                >
                    <Plus size={20} />
                    Nouvelle marque
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher une marque..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                        />
                    </div>
                </div>

                {/* Brands Table */}
                <BrandsTable
                    brands={filteredBrands}
                    loading={loading}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
