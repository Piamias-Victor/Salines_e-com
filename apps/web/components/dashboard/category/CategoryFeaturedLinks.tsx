'use client';

import { Plus, Trash2 } from 'lucide-react';

interface FeaturedLink {
    title: string;
    url: string;
    imageUrl: string;
}

interface CategoryFeaturedLinksProps {
    featuredLinks: FeaturedLink[];
    onAdd: () => void;
    onUpdate: (index: number, field: string, value: string) => void;
    onRemove: (index: number) => void;
}

export function CategoryFeaturedLinks({ featuredLinks, onAdd, onUpdate, onRemove }: CategoryFeaturedLinksProps) {
    return (
        <div className="space-y-4">
            {featuredLinks?.map((link, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                    <button
                        onClick={() => onRemove(index)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Titre</label>
                            <input
                                type="text"
                                value={link.title}
                                onChange={(e) => onUpdate(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">URL Cible</label>
                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) => onUpdate(index, 'url', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">URL Image</label>
                            <input
                                type="text"
                                value={link.imageUrl}
                                onChange={(e) => onUpdate(index, 'imageUrl', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={onAdd}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#fe0090] hover:text-[#fe0090] transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus size={18} />
                Ajouter un lien à la une
            </button>
        </div>
    );
}
