'use client';

import Link from 'next/link';
import { Plus, Tag, Percent } from 'lucide-react';
import { usePromotions } from '@/hooks/usePromotions';
import { usePromoCodes } from '@/hooks/usePromoCodes';
import { PromotionsTable } from '@/components/dashboard/promotions/PromotionsTable';
import { PromoCodesTable } from '@/components/dashboard/promotions/PromoCodesTable';
import { useState } from 'react';

export default function PromotionsPage() {
    const [activeTab, setActiveTab] = useState<'products' | 'codes'>('products');

    // Hooks for Product Promotions
    const {
        promotions,
        loading: loadingPromotions,
        saving: savingPromotions,
        deletePromotion,
        updatePositions
    } = usePromotions();

    // Hooks for Promo Codes
    const {
        promoCodes,
        loading: loadingCodes,
        deletePromoCode,
        toggleActive
    } = usePromoCodes();

    const handleDeletePromotion = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;
        const success = await deletePromotion(id);
        if (!success) alert('Erreur lors de la suppression');
    };

    const handleDeleteCode = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) return;
        const success = await deletePromoCode(id);
        if (!success) alert('Erreur lors de la suppression');
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
                    <p className="text-sm text-gray-500">Gérez les offres promotionnelles et codes promo</p>
                </div>
                <Link
                    href={activeTab === 'products' ? "/dashboard/promotions/new" : "/dashboard/promotions/promo-codes/new"}
                    className="flex items-center gap-2 px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20"
                >
                    <Plus size={20} />
                    {activeTab === 'products' ? 'Nouvelle promotion' : 'Nouveau code promo'}
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-4 px-2 flex items-center gap-2 font-medium transition-colors relative ${activeTab === 'products'
                            ? 'text-[#fe0090]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Tag size={18} />
                    Promotions Produits
                    {activeTab === 'products' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fe0090]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('codes')}
                    className={`pb-4 px-2 flex items-center gap-2 font-medium transition-colors relative ${activeTab === 'codes'
                            ? 'text-[#fe0090]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Percent size={18} />
                    Codes Promo
                    {activeTab === 'codes' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fe0090]" />
                    )}
                </button>
            </div>

            {activeTab === 'products' ? (
                <PromotionsTable
                    promotions={promotions}
                    loading={loadingPromotions}
                    saving={savingPromotions}
                    onDelete={handleDeletePromotion}
                    onReorder={updatePositions}
                />
            ) : (
                <PromoCodesTable
                    promoCodes={promoCodes}
                    loading={loadingCodes}
                    onDelete={handleDeleteCode}
                    onToggleActive={toggleActive}
                />
            )}
        </div>
    );
}
