'use client';

import { FormField, Textarea } from '@/components/ui';

interface CategoryBasicInfoProps {
    formData: {
        name: string;
        slug: string;
        description: string;
    };
    onChange: (field: string, value: string) => void;
    onNameChange: (name: string) => void;
}

export function CategoryBasicInfo({ formData, onChange, onNameChange }: CategoryBasicInfoProps) {
    return (
        <div className="space-y-6">
            <FormField label="Nom de la catégorie" name="name" required>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Ex: Soins du visage"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                />
            </FormField>

            <FormField label="Description" name="description">
                <Textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    fullWidth
                />
            </FormField>
        </div>
    );
}
