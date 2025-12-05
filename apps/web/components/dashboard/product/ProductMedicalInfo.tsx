'use client';

import { FormField, Textarea } from '@/components/ui';

interface ProductMedicalInfoProps {
    formData: {
        isMedicament: boolean;
        notice: string;
        composition: string;
        usageTips: string;
        maxOrderQuantity: string;
    };
    onChange: (field: string, value: string | boolean) => void;
}

export function ProductMedicalInfo({ formData, onChange }: ProductMedicalInfoProps) {
    return (
        <div className="space-y-6">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isMedicament ? 'bg-[#fe0090]' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.isMedicament ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <input
                    type="checkbox"
                    checked={formData.isMedicament}
                    onChange={(e) => {
                        onChange('isMedicament', e.target.checked);
                        if (e.target.checked) {
                            onChange('maxOrderQuantity', '6');
                        }
                    }}
                    className="hidden"
                />
                <div>
                    <span className="font-medium text-gray-900">C'est un médicament</span>
                    <p className="text-xs text-gray-500">Limite la commande à 6 unités et active le champ notice</p>
                </div>
            </label>

            {formData.isMedicament && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <FormField label="Lien de la notice (URL PDF)" name="notice" required>
                        <input
                            type="url"
                            required={formData.isMedicament}
                            value={formData.notice}
                            onChange={(e) => onChange('notice', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                        />
                    </FormField>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Composition" name="composition">
                    <Textarea
                        rows={3}
                        value={formData.composition}
                        onChange={(e) => onChange('composition', e.target.value)}
                        fullWidth
                    />
                </FormField>

                <FormField label="Conseils d'utilisation" name="usageTips">
                    <Textarea
                        rows={3}
                        value={formData.usageTips}
                        onChange={(e) => onChange('usageTips', e.target.value)}
                        fullWidth
                    />
                </FormField>
            </div>
        </div>
    );
}
