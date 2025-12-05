'use client';

import { FormField, Select, Textarea } from '@/components/ui';

interface ProductBasicInfoProps {
    formData: {
        name: string;
        ean: string;
        sku: string;
        shortDescription: string;
        description: string;
        slug: string;
    };
    onChange: (field: string, value: string) => void;
    onNameChange: (name: string) => void;
}

export function ProductBasicInfo({ formData, onChange, onNameChange }: ProductBasicInfoProps) {
    return (
        <div className="space-y-6">
            <FormField label="Nom du produit" name="name" required>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Ex: Doliprane 1000mg"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                />
            </FormField>

            <div className="grid grid-cols-2 gap-6">
                <FormField
                    label="Code EAN"
                    name="ean"
                    required
                    tooltip="Le code-barres unique du produit (13 chiffres)"
                >
                    <input
                        type="text"
                        required
                        value={formData.ean}
                        onChange={(e) => onChange('ean', e.target.value)}
                        placeholder="34009..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-mono"
                    />
                </FormField>

                <FormField label="SKU (Référence interne)" name="sku">
                    <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => onChange('sku', e.target.value)}
                        placeholder="REF-001"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-mono"
                    />
                </FormField>
            </div>

            <FormField
                label="Description courte"
                name="shortDescription"
                tooltip="Un résumé accrocheur affiché dans les listes de produits"
            >
                <Textarea
                    rows={3}
                    value={formData.shortDescription}
                    onChange={(e) => onChange('shortDescription', e.target.value)}
                    fullWidth
                />
            </FormField>

            <FormField label="Description complète" name="description">
                <Textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    fullWidth
                />
            </FormField>
        </div>
    );
}
