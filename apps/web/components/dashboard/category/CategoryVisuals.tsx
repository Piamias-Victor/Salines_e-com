'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface CategoryVisualsProps {
    formData: {
        imageUrl: string;
        highlightColor: string;
        highlightTextColor: string;
    };
    onChange: (field: string, value: string) => void;
}

export function CategoryVisuals({ formData, onChange }: CategoryVisualsProps) {
    return (
        <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center group hover:border-[#fe0090] transition-colors h-40 w-full">
                {formData.imageUrl ? (
                    <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="text-center p-4">
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-300 group-hover:text-[#fe0090] transition-colors" />
                        <p className="mt-2 text-xs text-gray-500">Image de catégorie</p>
                    </div>
                )}
            </div>
            <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => onChange('imageUrl', e.target.value)}
                placeholder="URL de l'image..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
            />

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Couleur de mise en avant</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={formData.highlightColor || '#ffffff'}
                        onChange={(e) => onChange('highlightColor', e.target.value)}
                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={formData.highlightColor}
                        onChange={(e) => onChange('highlightColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Couleur du texte</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={formData.highlightTextColor || '#000000'}
                        onChange={(e) => onChange('highlightTextColor', e.target.value)}
                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={formData.highlightTextColor}
                        onChange={(e) => onChange('highlightTextColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                    />
                </div>
            </div>
        </div>
    );
}
