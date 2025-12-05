'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';
import { BannersTable } from '@/components/dashboard/banners/BannersTable';

export default function BannersPage() {
    const { banners, loading, saving, deleteBanner, updatePositions } = useBanners();

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) return;

        const success = await deleteBanner(id);
        if (!success) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bannières</h1>
                    <p className="text-sm text-gray-500">Gérez les bannières de la page d'accueil</p>
                </div>
                <Link
                    href="/dashboard/banners/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20"
                >
                    <Plus size={20} />
                    Nouvelle bannière
                </Link>
            </div>

            <BannersTable
                banners={banners}
                loading={loading}
                saving={saving}
                onDelete={handleDelete}
                onReorder={updatePositions}
            />
        </div>
    );
}
