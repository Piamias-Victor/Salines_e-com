'use client';

import { FormField } from '@/components/ui';

interface ProductStockProps {
    formData: {
        stock: string;
        maxOrderQuantity: string;
        weight: string;
        isMedicament: boolean;
    };
    onChange: (field: string, value: string) => void;
}

export function ProductStock({ formData, onChange }: ProductStockProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Stock & Livraison</h3>
            <div className="space-y-4">
                <FormField label="Stock disponible" name="stock">
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => onChange('stock', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                    />
                </FormField>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Limite de commande
                        {formData.isMedicament && <span className="text-[#fe0090] ml-1">(Fixé à 6 pour les médicaments)</span>}
                    </label>
                    <input
                        type="number"
                        value={formData.maxOrderQuantity}
                        disabled={formData.isMedicament}
                        onChange={(e) => onChange('maxOrderQuantity', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <FormField label="Poids (kg)" name="weight">
                    <input
                        type="number"
                        step="0.001"
                        value={formData.weight}
                        onChange={(e) => onChange('weight', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                    />
                </FormField>
            </div>
        </div>
    );
}
