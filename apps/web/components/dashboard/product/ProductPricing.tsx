'use client';

import { FormField, Select } from '@/components/ui';

interface ProductPricingProps {
    formData: {
        priceHT: string;
        tva: string;
        priceTTC: string;
        stock: string;
        maxOrderQuantity: string;
        weight: string;
        isMedicament: boolean;
    };
    onChange: (field: string, value: string) => void;
    onPriceChange: (field: 'HT' | 'TTC', value: string) => void;
}

export function ProductPricing({ formData, onChange, onPriceChange }: ProductPricingProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Prix HT" name="priceHT" required>
                <div className="relative">
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.priceHT}
                        onChange={(e) => onPriceChange('HT', e.target.value)}
                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                </div>
            </FormField>

            <FormField label="TVA" name="tva" required>
                <Select
                    value={formData.tva}
                    onChange={(e) => onChange('tva', e.target.value)}
                    fullWidth
                >
                    <option value="20">20% (Standard)</option>
                    <option value="10">10% (Intermédiaire)</option>
                    <option value="5.5">5.5% (Réduit)</option>
                    <option value="2.1">2.1% (Super réduit)</option>
                </Select>
            </FormField>

            <FormField label="Prix TTC" name="priceTTC" required>
                <div className="relative">
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.priceTTC}
                        onChange={(e) => onPriceChange('TTC', e.target.value)}
                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-semibold text-gray-900"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                </div>
            </FormField>
        </div>
    );
}
