'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';

interface Brand {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    position: number;
    isActive: boolean;
}

function BrandRow({ brand, onDelete }: { brand: Brand; onDelete: (id: string) => void }) {
    return (
        <div className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {brand.imageUrl ? (
                        <Image
                            src={brand.imageUrl}
                            alt={brand.name}
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <div className="text-gray-300">
                            <Package size={24} />
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-medium text-gray-900">{brand.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">/{brand.slug}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${brand.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {brand.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={`/dashboard/brands/${brand.id}`}
                        className="p-2 text-gray-400 hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-colors"
                    >
                        <Edit2 size={18} />
                    </Link>
                    <button
                        onClick={() => onDelete(brand.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            if (!res.ok) throw new Error('Failed to fetch brands');

            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error('API returned non-array data:', data);
                throw new Error('Invalid data format received');
            }

            // Sort by name for list view
            const sortedBrands = data.sort((a: Brand, b: Brand) => a.name.localeCompare(b.name));
            setBrands(sortedBrands);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) return;

        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchBrands();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
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

                {/* Brands List */}
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Chargement...</div>
                    ) : filteredBrands.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Aucune marque trouvée</div>
                    ) : (
                        filteredBrands.map((brand) => (
                            <BrandRow key={brand.id} brand={brand} onDelete={handleDelete} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
