'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ProductImageUploadProps {
    imageUrl: string;
    onChange: (url: string) => void;
}

export function ProductImageUpload({ imageUrl, onChange }: ProductImageUploadProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Image principale</h3>
            <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center group hover:border-[#fe0090] transition-colors h-48 w-full">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Preview"
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <div className="text-center p-4">
                            <ImageIcon className="mx-auto h-8 w-8 text-gray-300 group-hover:text-[#fe0090] transition-colors" />
                            <p className="mt-2 text-xs text-gray-500">Aperçu de l'image</p>
                        </div>
                    )}
                </div>
                <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                />
            </div>
        </div>
    );
}
