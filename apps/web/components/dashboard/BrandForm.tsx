'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Type, Image as ImageIcon, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FormSection, FormField, Card } from '@/components/ui';
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
        return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const url = initialData ? `/api/brands/${initialData.id}` : '/api/brands';
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

    const handleFieldChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/brands" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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

                <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20 disabled:opacity-50">
                    {loading ? (<><Loader2 size={20} className="animate-spin" />Enregistrement...</>) : (<><Save size={20} />Enregistrer</>)}
                </button>
            </div>

            <div className="space-y-6">
                <FormSection icon={Type} title="Informations générales" description="Nom et description de la marque">
                    <div className="space-y-4">
                        <FormField label="Nom de la marque" name="name" required>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                placeholder="Ex: L'Oréal"
                            />
                        </FormField>

                        <FormField label="Slug (URL)" name="slug">
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleFieldChange('slug', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono text-sm"
                                placeholder="loreal"
                            />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection icon={ImageIcon} title="Visuels" description="Image/Logo de la marque">
                    <FormField label="URL de l'image/logo" name="imageUrl">
                        <input
                            type="text"
                            value={formData.imageUrl || ''}
                            onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            placeholder="https://..."
                        />
                    </FormField>
                </FormSection>

                <Card className="overflow-hidden">
                    <FormSection icon={Package} title="Produits associés" description="Sélectionnez les produits de cette marque">
                        <div className="p-6">
                            <ProductPicker
                                selectedProductIds={formData.productIds}
                                onChange={(ids) => handleFieldChange('productIds', ids as any)}
                            />
                        </div>
                    </FormSection>
                </Card>

                <Card>
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
