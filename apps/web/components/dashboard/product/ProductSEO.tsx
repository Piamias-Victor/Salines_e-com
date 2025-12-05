'use client';

import { FormField, Textarea } from '@/components/ui';

interface ProductSEOProps {
    formData: {
        metaTitle: string;
        metaDescription: string;
        slug: string;
    };
    onChange: (field: string, value: string) => void;
}

export function ProductSEO({ formData, onChange }: ProductSEOProps) {
    return (
        <div className="space-y-6">
            <FormField
                label="Meta Titre"
                name="metaTitle"
                tooltip="Le titre qui apparaît en bleu dans les résultats Google. Idéalement entre 50 et 60 caractères."
            >
                <div className="relative">
                    <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => onChange('metaTitle', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all pr-16"
                    />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                        {formData.metaTitle.length}/60
                    </span>
                </div>
            </FormField>

            <FormField
                label="Meta Description"
                name="metaDescription"
                tooltip="Le petit texte sous le titre dans Google. Doit donner envie de cliquer. Idéalement entre 150 et 160 caractères."
            >
                <div className="relative">
                    <Textarea
                        rows={3}
                        value={formData.metaDescription}
                        onChange={(e) => onChange('metaDescription', e.target.value)}
                        fullWidth
                    />
                    <span className={`absolute right-3 bottom-3 text-xs ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                        {formData.metaDescription.length}/160
                    </span>
                </div>
            </FormField>

            <FormField
                label="Slug URL"
                name="slug"
                tooltip="L'adresse web de la page produit. Doit être unique et contenir des mots-clés."
            >
                <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2.5 text-gray-500 text-sm">
                        /produits/
                    </span>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => onChange('slug', e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-mono text-sm"
                    />
                </div>
            </FormField>
        </div>
    );
}
