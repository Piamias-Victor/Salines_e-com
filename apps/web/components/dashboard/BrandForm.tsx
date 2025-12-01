'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, ArrowLeft, Upload, Type, Image as ImageIcon, Package } from 'lucide-react';
import Link from 'next/link';
import { ProductPicker } from './ProductPicker';

interface BrandFormProps {
    initialData?: any;
}

export function BrandForm({ initialData }: BrandFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        imageUrl: initialData?.imageUrl || '',
        isActive: initialData?.isActive ?? true,
        productIds: initialData?.products?.map((p: any) => p.productId) || [],
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const url = initialData
                ? `/api/brands/${initialData.id}`
                : '/api/brands';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard/brands');
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving brand:', error);
            alert('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const SectionHeader = ({ icon: Icon, title, description }: any) => (
        <div className="bg-gradient-to-r from-[#fe0090]/5 to-transparent p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fe0090]/10 rounded-lg">
                    <Icon className="text-[#fe0090]" size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/brands"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData ? 'Modifier la marque' : 'Nouvelle marque'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {initialData ? 'Modifiez les informations de la marque' : 'Créez une nouvelle marque'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20 disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>

            <div className="space-y-6">
                {/* General Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Type}
                        title="Informations générales"
                        description="Nom et description de la marque"
                    />
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom de la marque *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        name,
                                        slug: generateSlug(name)
                                    }));
                                }}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: L'Oréal"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug (URL)
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono text-sm"
                                placeholder="loreal"
                            />
                        </div>
                    </div>
                </div>

                {/* Visuals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={ImageIcon}
                        title="Visuels"
                        description="Image/Logo de la marque"
                    />
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL de l'image/logo
                            </label>
                            <input
                                type="text"
                                value={formData.imageUrl || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Package}
                        title="Produits associés"
                        description="Sélectionnez les produits de cette marque"
                    />
                    <div className="p-6">
                        <ProductPicker
                            selectedProductIds={formData.productIds}
                            onChange={(ids) => setFormData(prev => ({ ...prev, productIds: ids }))}
                        />
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Marque active
                                </label>
                                <p className="text-xs text-gray-500">
                                    Afficher cette marque sur le site
                                </p>
                            </div>
                            <button
                                type="button"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
