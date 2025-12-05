'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Calendar, Tag, Percent, Euro, Loader2 } from 'lucide-react';
import { FormSection, FormField, Card } from '@/components/ui';
import { ProductPicker } from './ProductPicker';

interface PromotionFormProps {
    initialData?: {
        id?: string;
        title: string;
        imageUrl: string;
        amount: number;
        type: 'EURO' | 'PERCENT';
        redirectUrl: string;
        isActive: boolean;
        startDate: string | null;
        endDate: string | null;
        products: { productId: string }[];
        buttonText?: string;
        buttonColor?: string;
        buttonTextColor?: string;
    };
}

export function PromotionForm({ initialData }: PromotionFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        imageUrl: initialData?.imageUrl || '',
        amount: initialData?.amount?.toString() || '',
        type: initialData?.type || 'PERCENT',
        redirectUrl: initialData?.redirectUrl || '',
        isActive: initialData?.isActive ?? true,
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        productIds: initialData?.products?.map(p => p.productId) || [],
        buttonText: initialData?.buttonText || 'JE FONCE',
        buttonColor: initialData?.buttonColor || '#fe0090',
        buttonTextColor: initialData?.buttonTextColor || '#ffffff',
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const url = initialData?.id ? `/api/promotions/${initialData.id}` : '/api/promotions';
            const method = initialData?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount) || 0,
                }),
            });

            if (!res.ok) throw new Error('Failed to save promotion');

            router.push('/dashboard/promotions');
            router.refresh();
        } catch (error) {
            console.error('Error saving promotion:', error);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (field: string, value: string | boolean | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData ? 'Modifier la promotion' : 'Nouvelle promotion'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {initialData ? 'Mettez à jour les informations' : 'Créez une nouvelle offre promotionnelle'}
                        </p>
                    </div>
                </div>
                <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-[#fe0090] text-white rounded-xl hover:bg-[#fe0090]/90 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 font-medium">
                    {loading ? (<><Loader2 size={18} className="animate-spin" />Enregistrement...</>) : (<><Save size={18} />Enregistrer</>)}
                </button>
            </div>

            <div className="space-y-6">
                <FormSection icon={Tag} title="Informations générales" description="Titre et visuel de la promotion">
                    <div className="space-y-6">
                        <FormField label="Titre de la promotion" name="title">
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: Soldes d'été"
                            />
                        </FormField>

                        <FormField label="URL de l'image" name="imageUrl">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                {formData.imageUrl && (
                                    <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </FormField>

                        <FormField label="Lien de redirection" name="redirectUrl">
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.redirectUrl}
                                    onChange={(e) => handleFieldChange('redirectUrl', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                    placeholder="/category/soldes"
                                />
                            </div>
                        </FormField>
                    </div>
                </FormSection>

                <FormSection icon={Percent} title="Réduction" description="Définir le montant et le type de réduction">
                    <div className="grid grid-cols-2 gap-6">
                        <FormField label="Type de réduction" name="type">
                            <div className="flex p-1 bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => handleFieldChange('type', 'PERCENT')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'PERCENT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Percent size={16} />
                                    Pourcentage
                                </button>
                                <button
                                    onClick={() => handleFieldChange('type', 'EURO')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'EURO' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Euro size={16} />
                                    Montant fixe
                                </button>
                            </div>
                        </FormField>

                        <FormField label="Valeur de la réduction" name="amount">
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                    placeholder="0"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                    {formData.type === 'PERCENT' ? '%' : '€'}
                                </div>
                            </div>
                        </FormField>
                    </div>
                </FormSection>

                <FormSection icon={Tag} title="Personnalisation du bouton" description="Personnalisez l'apparence du bouton d'action">
                    <div className="space-y-6">
                        <FormField label="Texte du bouton" name="buttonText">
                            <input
                                type="text"
                                value={formData.buttonText}
                                onChange={(e) => handleFieldChange('buttonText', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="JE FONCE"
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField label="Couleur du bouton" name="buttonColor">
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.buttonColor}
                                        onChange={(e) => handleFieldChange('buttonColor', e.target.value)}
                                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.buttonColor}
                                        onChange={(e) => handleFieldChange('buttonColor', e.target.value)}
                                        placeholder="#fe0090"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                                    />
                                </div>
                            </FormField>

                            <FormField label="Couleur du texte" name="buttonTextColor">
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.buttonTextColor}
                                        onChange={(e) => handleFieldChange('buttonTextColor', e.target.value)}
                                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.buttonTextColor}
                                        onChange={(e) => handleFieldChange('buttonTextColor', e.target.value)}
                                        placeholder="#ffffff"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                                    />
                                </div>
                            </FormField>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Aperçu du bouton :</p>
                            <button
                                type="button"
                                className="px-6 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105"
                                style={{ backgroundColor: formData.buttonColor, color: formData.buttonTextColor }}
                            >
                                {formData.buttonText || 'JE FONCE'}
                            </button>
                        </div>
                    </div>
                </FormSection>

                <FormSection icon={Calendar} title="Planification" description="Dates de validité de l'offre">
                    <div className="space-y-6">
                        <Card className="bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Statut de la promotion</label>
                                    <p className="text-sm text-gray-500">Activer ou désactiver cette offre</p>
                                </div>
                                <button
                                    onClick={() => handleFieldChange('isActive', !formData.isActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-[#fe0090]' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField label="Date de début" name="startDate">
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                />
                            </FormField>
                            <FormField label="Date de fin" name="endDate">
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                />
                            </FormField>
                        </div>
                    </div>
                </FormSection>

                <Card className="overflow-hidden">
                    <FormSection icon={Tag} title="Produits concernés" description="Sélectionnez les produits inclus dans cette promotion">
                        <div className="p-6">
                            <ProductPicker
                                selectedProductIds={formData.productIds}
                                onChange={(ids) => handleFieldChange('productIds', ids)}
                            />
                        </div>
                    </FormSection>
                </Card>
            </div>
        </div>
    );
}
