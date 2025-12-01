'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, FolderTree, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

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

function CategoryRow({ category, onDelete, level = 0 }: { category: Category; onDelete: (id: string) => void; level?: number }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <>
            <div
                className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${category.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                    </span>

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

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');

            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error('API returned non-array data:', data);
                throw new Error('Invalid data format received');
            }

            // Keep hierarchical structure, sorted by name for list view
            const rootCategories = data.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
            setCategories(rootCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]); // Ensure state is empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchCategories();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const filteredCategories = searchQuery
        ? categories.filter((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : categories;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
                    <p className="text-sm text-gray-500">Gérez vos catégories (création, modification, suppression)</p>
                </div>
                <Link
                    href="/dashboard/categories/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20"
                >
                    <Plus size={20} />
                    Nouvelle catégorie
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher une catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                        />
                    </div>
                </div>

                {/* Categories List */}
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Chargement...</div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Aucune catégorie trouvée</div>
                    ) : (
                        filteredCategories.map((category) => (
                            <CategoryRow key={category.id} category={category} onDelete={handleDelete} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
