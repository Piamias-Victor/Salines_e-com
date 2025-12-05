'use client';

import { FormField, Textarea } from '@/components/ui';

interface CategorySEOProps {
    formData: {
        metaTitle: string;
        metaDescription: string;
        slug: string;
    };
    onChange: (field: string, value: string) => void;
}

export function CategorySEO({ formData, onChange }: CategorySEOProps) {
    return (
        <div className="space-y-6">
            <FormField label="Titre Meta (SEO)" name="metaTitle">
                <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => onChange('metaTitle', e.target.value)}
                    placeholder="Titre pour les moteurs de recherche"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                />
            </FormField>

            <FormField label="Description Meta (SEO)" name="metaDescription">
                <Textarea
                    rows={3}
                    value={formData.metaDescription}
                    onChange={(e) => onChange('metaDescription', e.target.value)}
                    placeholder="Description pour les résultats de recherche"
                    fullWidth
                />
            </FormField>

            <FormField label="Slug URL" name="slug">
                <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2.5 text-gray-500 text-sm">
                        /category/
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
