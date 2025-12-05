'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, ImageIcon, Type, Link as LinkIcon, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FormSection, FormField, Card, Checkbox } from '@/components/ui';

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
            const url = initialData ? `/api/banners/${initialData.id}` : '/api/banners';
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

    const handleFieldChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/banners" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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

                <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20 disabled:opacity-50">
                    {loading ? (<><Loader2 size={20} className="animate-spin" />Enregistrement...</>) : (<><Save size={20} />Enregistrer</>)}
                </button>
            </div>

            <div className="space-y-6">
                <FormSection icon={Type} title="Informations générales" description="Titre et texte alternatif">
                    <div className="space-y-4">
                        <FormField label="Titre (Accessibilité)" name="title" required>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: Promo d'été"
                            />
                        </FormField>

                        <FormField label="Texte alternatif (SEO)" name="alt" required>
                            <input
                                type="text"
                                value={formData.alt}
                                onChange={(e) => handleFieldChange('alt', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: Bannière promotionnelle pour les produits solaires"
                            />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection icon={Type} title="Personnalisation" description="Texte et bouton">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <FormField label="Texte affiché" name="text">
                                    <input
                                        type="text"
                                        value={formData.text}
                                        onChange={(e) => handleFieldChange('text', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                        placeholder="Ex: Découvrez nos promotions"
                                    />
                                </FormField>
                            </div>

                            <FormField label="Couleur du texte" name="textColor">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={formData.textColor}
                                        onChange={(e) => handleFieldChange('textColor', e.target.value)}
                                        className="h-10 w-20 p-1 rounded border border-gray-200 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500 font-mono">{formData.textColor}</span>
                                </div>
                            </FormField>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <Checkbox
                                checked={formData.showButton}
                                onChange={(e) => handleFieldChange('showButton', e.target.checked)}
                                label="Afficher un bouton"
                            />
                            <p className="text-xs text-gray-500 mt-1 ml-6">Ajouter un bouton d'action sur la bannière</p>

                            {formData.showButton && (
                                <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                                    <FormField label="Couleur du bouton" name="buttonColor">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={formData.buttonColor}
                                                onChange={(e) => handleFieldChange('buttonColor', e.target.value)}
                                                className="h-10 w-20 p-1 rounded border border-gray-200 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-500 font-mono">{formData.buttonColor}</span>
                                        </div>
                                    </FormField>
                                </div>
                            )}
                        </div>
                    </div>
                </FormSection>

                <FormSection icon={ImageIcon} title="Visuel" description="Image de la bannière">
                    <FormField label="URL de l'image" name="imageUrl" required>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            placeholder="https://..."
                        />
                    </FormField>
                </FormSection>

                <FormSection icon={LinkIcon} title="Navigation" description="Lien de redirection">
                    <FormField label="URL de redirection (Optionnel)" name="redirectUrl">
                        <input
                            type="text"
                            value={formData.redirectUrl}
                            onChange={(e) => handleFieldChange('redirectUrl', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            placeholder="https://... ou /categories/..."
                        />
                    </FormField>
                </FormSection>

                <FormSection icon={Calendar} title="Planification" description="Période d'affichage">
                    <div className="grid grid-cols-2 gap-4">
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
                </FormSection>

                <Card>
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
                            onClick={() => handleFieldChange('isActive', !formData.isActive)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-[#fe0090]' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
