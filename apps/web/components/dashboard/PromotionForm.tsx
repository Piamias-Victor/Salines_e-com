'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Calendar, Tag, Percent, Euro } from 'lucide-react';
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

function SectionHeader({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex items-start gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-[#fe0090]">
                <Icon size={20} />
            </div>
            <div>
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            </div>
        </div>
    );
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
            const url = initialData?.id
                ? `/api/promotions/${initialData.id}`
                : '/api/promotions';

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

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
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
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#fe0090] text-white rounded-xl hover:bg-[#fe0090]/90 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 font-medium"
                >
                    <Save size={18} />
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>

            <div className="space-y-6">
                {/* General Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Tag}
                        title="Informations générales"
                        description="Titre et visuel de la promotion"
                    />
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre de la promotion
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: Soldes d'été"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL de l'image
                            </label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                {formData.imageUrl && (
                                    <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lien de redirection
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.redirectUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, redirectUrl: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                    placeholder="/category/soldes"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discount Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Percent}
                        title="Réduction"
                        description="Définir le montant et le type de réduction"
                    />
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type de réduction
                                </label>
                                <div className="flex p-1 bg-gray-100 rounded-lg">
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'PERCENT' }))}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'PERCENT'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Percent size={16} />
                                        Pourcentage
                                    </button>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'EURO' }))}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'EURO'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Euro size={16} />
                                        Montant fixe
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valeur de la réduction
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                        placeholder="0"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                        {formData.type === 'PERCENT' ? '%' : '€'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button Customization */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Tag}
                        title="Personnalisation du bouton"
                        description="Personnalisez l'apparence du bouton d'action"
                    />
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texte du bouton
                            </label>
                            <input
                                type="text"
                                value={formData.buttonText}
                                onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="JE FONCE"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Couleur du bouton
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.buttonColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, buttonColor: e.target.value }))}
                                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.buttonColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, buttonColor: e.target.value }))}
                                        placeholder="#fe0090"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Couleur du texte
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.buttonTextColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, buttonTextColor: e.target.value }))}
                                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.buttonTextColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, buttonTextColor: e.target.value }))}
                                        placeholder="#ffffff"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Aperçu du bouton :</p>
                            <button
                                type="button"
                                className="px-6 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105"
                                style={{
                                    backgroundColor: formData.buttonColor,
                                    color: formData.buttonTextColor
                                }}
                            >
                                {formData.buttonText || 'JE FONCE'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scheduling */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Calendar}
                        title="Planification"
                        description="Dates de validité de l'offre"
                    />
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Statut de la promotion</label>
                                <p className="text-sm text-gray-500">Activer ou désactiver cette offre</p>
                            </div>
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-[#fe0090]' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Tag}
                        title="Produits concernés"
                        description="Sélectionnez les produits inclus dans cette promotion"
                    />
                    <div className="p-6">
                        <ProductPicker
                            selectedProductIds={formData.productIds}
                            onChange={(ids) => setFormData(prev => ({ ...prev, productIds: ids }))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
