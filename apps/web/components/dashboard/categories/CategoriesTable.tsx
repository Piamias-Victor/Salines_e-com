'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, FolderTree, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui';

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    position: number;
    menuPosition: number;
    isActive: boolean;
    children: Category[];
}

interface CategoriesTableProps {
    categories: Category[];
    loading: boolean;
    onDelete: (id: string) => void;
}

function CategoryRow({ category, onDelete, level = 0 }: { category: Category; onDelete: (id: string) => void; level?: number }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <>
            <div className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4" style={{ paddingLeft: `${level * 32}px` }}>
                    {level > 0 && <div className="w-5" />}

                    {hasChildren && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 rounded-md hover:bg-gray-200 text-gray-400 transition-colors"
                        >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    )}

                    {!hasChildren && <div className="w-6" />}

                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {category.imageUrl ? (
                            <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FolderTree size={20} />
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">/{category.slug}</span>
                            {level > 0 && (
                                <>
                                    <span>•</span>
                                    <span className="text-blue-600">Sous-catégorie</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Badge variant={category.isActive ? 'success' : 'neutral'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/dashboard/categories/${category.id}`}
                            className="p-2 text-gray-400 hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-colors"
                        >
                            <Edit2 size={18} />
                        </Link>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {isExpanded && hasChildren && (
                <>
                    {category.children.map((child) => (
                        <CategoryRow
                            key={child.id}
                            category={child}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </>
            )}
        </>
    );
}

export function CategoriesTable({ categories, loading, onDelete }: CategoriesTableProps) {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement...</div>;
    }

    if (categories.length === 0) {
        return <div className="p-8 text-center text-gray-500">Aucune catégorie trouvée</div>;
    }

    return (
        <div className="divide-y divide-gray-100">
            {categories.map((category) => (
                <CategoryRow key={category.id} category={category} onDelete={onDelete} />
            ))}
        </div>
    );
}
