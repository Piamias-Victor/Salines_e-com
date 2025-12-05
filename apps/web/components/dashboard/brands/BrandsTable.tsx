'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, Package } from 'lucide-react';
import { Badge } from '@/components/ui';

interface Brand {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    position: number;
    isActive: boolean;
}

interface BrandsTableProps {
    brands: Brand[];
    loading: boolean;
    onDelete: (id: string) => void;
}

export function BrandsTable({ brands, loading, onDelete }: BrandsTableProps) {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement...</div>;
    }

    if (brands.length === 0) {
        return <div className="p-8 text-center text-gray-500">Aucune marque trouvée</div>;
    }

    return (
        <div className="divide-y divide-gray-100">
            {brands.map((brand) => (
                <div
                    key={brand.id}
                    className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
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
                                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                    /{brand.slug}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Badge variant={brand.isActive ? 'success' : 'neutral'}>
                            {brand.isActive ? 'Active' : 'Inactive'}
                        </Badge>

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
            ))}
        </div>
    );
}
