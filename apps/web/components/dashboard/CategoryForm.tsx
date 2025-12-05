'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, LayoutGrid, Package, Link as LinkIcon, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FormSection, Card } from '@/components/ui';
import { CategoryBasicInfo } from './category/CategoryBasicInfo';
import { CategoryFeaturedLinks } from './category/CategoryFeaturedLinks';
import { CategoryProducts } from './category/CategoryProducts';
import { CategoryParents } from './category/CategoryParents';
import { CategoryVisuals } from './category/CategoryVisuals';
import { CategoryStatus } from './category/CategoryStatus';
import { CategorySEO } from './category/CategorySEO';

interface FeaturedLink {
    title: string;
    url: string;
    imageUrl: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    highlightColor: string | null;
    highlightTextColor: string | null;
    position: number;
    menuPosition: number;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    parentIds: string[];
    featuredLinks: FeaturedLink[];
    productIds: string[];
}

interface CategoryFormProps {
    initialData?: any;
    categories?: Category[];
    isEditing?: boolean;
    onSubmit?: (data: any) => Promise<void>;
}

export function CategoryForm({ initialData, categories = [], isEditing = false, onSubmit }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        imageUrl: initialData?.imageUrl || '',
        highlightColor: initialData?.highlightColor || '',
        highlightTextColor: initialData?.highlightTextColor || '',
        position: initialData?.position || 0,
        menuPosition: initialData?.menuPosition || 0,
        isActive: initialData?.isActive ?? true,
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        parentIds: initialData?.parents?.map((p: any) => p.id) || [],
        featuredLinks: initialData?.featuredLinks || [],
        productIds: initialData?.products?.map((p: any) => p.productId) || [],
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
    });

    const generateSlug = (name: string) => {
        return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (onSubmit) {
                await onSubmit(formData);
            } else {
                const url = isEditing ? `/api/categories/${initialData.id}` : '/api/categories';
                const method = isEditing ? 'PUT' : 'POST';

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!res.ok) throw new Error('Failed to save category');
                router.push('/dashboard/categories');
                router.refresh();
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Une erreur est survenue lors de l\'enregistrement');
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

    const toggleParent = (parentId: string) => {
        setFormData(prev => ({
            ...prev,
            parentIds: prev.parentIds.includes(parentId)
                ? prev.parentIds.filter((id: string) => id !== parentId)
                : [...prev.parentIds, parentId],
        }));
    };

    const addFeaturedLink = () => {
        setFormData(prev => ({
            ...prev,
            featuredLinks: [...(prev.featuredLinks || []), { title: '', url: '', imageUrl: '' }]
        }));
    };

    const updateFeaturedLink = (index: number, field: string, value: string) => {
        const newLinks = [...(formData.featuredLinks || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData(prev => ({ ...prev, featuredLinks: newLinks }));
    };

    const removeFeaturedLink = (index: number) => {
        const newLinks = [...(formData.featuredLinks || [])];
        newLinks.splice(index, 1);
        setFormData(prev => ({ ...prev, featuredLinks: newLinks }));
    };

    return (
        <div className="pb-20">
            {/* Header Actions */}
            <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-md px-6 py-4 -mx-6 -mt-6 mb-8 border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/categories" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {isEditing ? "Mettez à jour les informations de la catégorie" : "Créez une nouvelle catégorie de produits"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/categories" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Annuler
                        </Link>
                        <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#fe0090] rounded-lg hover:bg-[#fe0090]/90 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (<><Loader2 size={18} className="animate-spin" />Enregistrement...</>) : (<><Save size={18} />Enregistrer</>)}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <FormSection icon={LayoutGrid} title="Informations générales" description="Les informations de base de votre catégorie.">
                        <CategoryBasicInfo formData={formData} onChange={handleFieldChange} onNameChange={handleNameChange} />
                    </FormSection>

                    <Card className="overflow-hidden">
                        <FormSection icon={Package} title="Produits associés" description="Sélectionnez les produits appartenant à cette catégorie">
                            <CategoryProducts selectedProductIds={formData.productIds} onChange={(ids) => handleFieldChange('productIds', ids as any)} />
                        </FormSection>
                    </Card>

                    <FormSection icon={LinkIcon} title="Liens à la une" description="Gérez les liens mis en avant dans le Mega Menu pour cette catégorie.">
                        <CategoryFeaturedLinks
                            featuredLinks={formData.featuredLinks}
                            onAdd={addFeaturedLink}
                            onUpdate={updateFeaturedLink}
                            onRemove={removeFeaturedLink}
                        />
                    </FormSection>

                    <FormSection icon={Search} title="Optimisation SEO" description="Améliorez la visibilité de votre catégorie.">
                        <CategorySEO formData={formData} onChange={handleFieldChange} />
                    </FormSection>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">
                    <Card>
                        <h3 className="font-semibold text-gray-900 mb-4">État & Programmation</h3>
                        <CategoryStatus formData={formData} onChange={handleFieldChange} />
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-gray-900 mb-4">Visuels</h3>
                        <CategoryVisuals formData={formData} onChange={handleFieldChange} />
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-gray-900 mb-4">Catégories parentes</h3>
                        <CategoryParents
                            categories={categories}
                            selectedParentIds={formData.parentIds}
                            currentCategoryId={initialData?.id}
                            onToggle={toggleParent}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
