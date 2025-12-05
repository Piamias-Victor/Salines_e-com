'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { usePromotions } from '@/hooks/usePromotions';
import { PromotionsTable } from '@/components/dashboard/promotions/PromotionsTable';

export default function PromotionsPage() {
    const { promotions, loading, saving, deletePromotion, updatePositions } = usePromotions();

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;

        const success = await deletePromotion(id);
        if (!success) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
                    <p className="text-sm text-gray-500">Gérez les offres promotionnelles</p>
                </div>
                <Link
                    href="/dashboard/promotions/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20"
                >
                    <Plus size={20} />
                    Nouvelle promotion
                </Link>
            </div>

            <PromotionsTable
                promotions={promotions}
                loading={loading}
                saving={saving}
                onDelete={handleDelete}
                onReorder={updatePositions}
            />
        </div>
    );
}
