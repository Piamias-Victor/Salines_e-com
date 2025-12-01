'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, ImageIcon, Type, Link as LinkIcon, Calendar } from 'lucide-react';
import Link from 'next/link';

interface BannerFormProps {
    initialData?: any;
}

export function BannerForm({ initialData }: BannerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        alt: initialData?.alt || '',
        imageUrl: initialData?.imageUrl || '',
        redirectUrl: initialData?.redirectUrl || '',
        isActive: initialData?.isActive ?? true,
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        text: initialData?.text || '',
        textColor: initialData?.textColor || '#000000',
        showButton: initialData?.showButton || false,
        buttonColor: initialData?.buttonColor || '#fe0090',
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const url = initialData
                ? `/api/banners/${initialData.id}`
                : '/api/banners';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard/banners');
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving banner:', error);
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
                        href="/dashboard/banners"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData ? 'Modifier la bannière' : 'Nouvelle bannière'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {initialData ? 'Modifiez les informations de la bannière' : 'Créez une nouvelle bannière'}
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
                        description="Titre et texte alternatif"
                    />
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre (Accessibilité) *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: Promo d'été"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texte alternatif (SEO) *
                            </label>
                            <input
                                type="text"
                                value={formData.alt}
                                onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: Bannière promotionnelle pour les produits solaires"
                            />
                        </div>
                    </div>
                </div>

                {/* Customization */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Type}
                        title="Personnalisation"
                        description="Texte et bouton"
                    />
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texte affiché
                                </label>
                                <input
                                    type="text"
                                    value={formData.text}
                                    onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                    placeholder="Ex: Découvrez nos promotions"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Couleur du texte
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={formData.textColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="h-10 w-20 p-1 rounded border border-gray-200 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500 font-mono">{formData.textColor}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Afficher un bouton
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        Ajouter un bouton d'action sur la bannière
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, showButton: !prev.showButton }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.showButton ? 'bg-[#fe0090]' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.showButton ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {formData.showButton && (
                                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Couleur du bouton
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={formData.buttonColor}
                                                onChange={(e) => setFormData(prev => ({ ...prev, buttonColor: e.target.value }))}
                                                className="h-10 w-20 p-1 rounded border border-gray-200 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-500 font-mono">{formData.buttonColor}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Visuals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={ImageIcon}
                        title="Visuel"
                        description="Image de la bannière"
                    />
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL de l'image *
                            </label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={LinkIcon}
                        title="Navigation"
                        description="Lien de redirection"
                    />
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL de redirection (Optionnel)
                            </label>
                            <input
                                type="text"
                                value={formData.redirectUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, redirectUrl: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="https://... ou /categories/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Scheduling */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <SectionHeader
                        icon={Calendar}
                        title="Planification"
                        description="Période d'affichage"
                    />
                    <div className="p-6 grid grid-cols-2 gap-4">
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

                {/* Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Bannière active
                                </label>
                                <p className="text-xs text-gray-500">
                                    Afficher cette bannière sur le site
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
