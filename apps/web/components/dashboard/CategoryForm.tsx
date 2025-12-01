'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, ArrowLeft, Upload, Type, Image as ImageIcon, Layout, Calendar, Link as LinkIcon, Trash2, Plus, GripVertical, Package, Loader2, LayoutGrid, Search } from 'lucide-react';
import Link from 'next/link';
import { ProductPicker } from './ProductPicker';

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
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
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

    const toggleParent = (parentId: string) => {
        setFormData((prev) => ({
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

    const SectionHeader = ({ icon: Icon, title, description }: any) => (
        <div className="flex items-start gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-pink-50 rounded-lg text-[#fe0090]">
                <Icon size={20} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="pb-20">
            {/* Header Actions */}
            <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-md px-6 py-4 -mx-6 -mt-6 mb-8 border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/categories"
                            className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900"
                        >
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
                        <Link
                            href="/dashboard/categories"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#fe0090] rounded-lg hover:bg-[#fe0090]/90 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Enregistrer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* General Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
                        <SectionHeader
                            icon={LayoutGrid}
                            title="Informations générales"
                            description="Les informations de base de votre catégorie."
                        />

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Nom de la catégorie
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            name,
                                            slug: generateSlug(name),
                                        }));
                                    }}
                                    placeholder="Ex: Soins du visage"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Associated Products */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <SectionHeader
                            icon={Package}
                            title="Produits associés"
                            description="Sélectionnez les produits appartenant à cette catégorie"
                        />
                        <div className="p-6">
                            <ProductPicker
                                selectedProductIds={formData.productIds}
                                onChange={(ids) => setFormData(prev => ({ ...prev, productIds: ids }))}
                            />
                        </div>
                    </div>

                    {/* Featured Links Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
                        <SectionHeader
                            icon={LinkIcon}
                            title="Liens à la une"
                            description="Gérez les liens mis en avant dans le Mega Menu pour cette catégorie."
                        />

                        <div className="space-y-4">
                            {formData.featuredLinks?.map((link: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                    <button
                                        onClick={() => removeFeaturedLink(index)}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Titre</label>
                                            <input
                                                type="text"
                                                value={link.title}
                                                onChange={(e) => updateFeaturedLink(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">URL Cible</label>
                                            <input
                                                type="text"
                                                value={link.url}
                                                onChange={(e) => updateFeaturedLink(index, 'url', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">URL Image</label>
                                            <input
                                                type="text"
                                                value={link.imageUrl}
                                                onChange={(e) => updateFeaturedLink(index, 'imageUrl', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addFeaturedLink}
                                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#fe0090] hover:text-[#fe0090] transition-all flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus size={18} />
                                Ajouter un lien à la une
                            </button>
                        </div>
                    </div>

                    {/* SEO Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
                        <SectionHeader
                            icon={Search}
                            title="Optimisation SEO"
                            description="Améliorez la visibilité de votre catégorie."
                        />

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Titre Meta (SEO)
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                    placeholder="Titre pour les moteurs de recherche"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description Meta (SEO)
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                    placeholder="Description pour les résultats de recherche"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Slug URL
                                </label>
                                <div className="flex items-center">
                                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2.5 text-gray-500 text-sm">
                                        /category/
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">

                    {/* Status & Scheduling Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">État & Programmation</h3>

                        <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border mb-6 ${formData.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div>
                                <span className={`block font-medium ${formData.isActive ? 'text-green-700' : 'text-gray-700'}`}>
                                    {formData.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formData.isActive ? 'Visible sur le site' : 'Cachée du site'}
                                </span>
                            </div>
                            <div className={`w-12 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${formData.isActive ? 'translate-x-5' : ''}`} />
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="hidden"
                            />
                        </label>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Date de début (Optionnel)</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Date de fin (Optionnel)</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visuals Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Visuels</h3>
                        <div className="space-y-4">
                            <div className="relative rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center group hover:border-[#fe0090] transition-colors h-40 w-full">
                                {formData.imageUrl ? (
                                    <Image
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon className="mx-auto h-8 w-8 text-gray-300 group-hover:text-[#fe0090] transition-colors" />
                                        <p className="mt-2 text-xs text-gray-500">Image de catégorie</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                placeholder="URL de l'image..."
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            />

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Couleur de mise en avant</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.highlightColor || '#ffffff'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, highlightColor: e.target.value }))}
                                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.highlightColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, highlightColor: e.target.value }))}
                                        placeholder="#000000"
                                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Couleur du texte</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.highlightTextColor || '#000000'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, highlightTextColor: e.target.value }))}
                                        className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.highlightTextColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, highlightTextColor: e.target.value }))}
                                        placeholder="#000000"
                                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parent Categories Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Catégories parentes</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {categories.filter(c => c.id !== initialData?.id).map((cat) => {
                                const isSelected = formData.parentIds.includes(cat.id);
                                return (
                                    <label
                                        key={cat.id}
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border text-sm ${isSelected
                                            ? 'bg-pink-50 border-[#fe0090] text-[#fe0090]'
                                            : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        <span>{cat.name}</span>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleParent(cat.id)}
                                            className="hidden"
                                        />
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#fe0090]" />}
                                    </label>
                                );
                            })}
                            {categories.length === 0 && (
                                <p className="text-sm text-gray-400 italic text-center py-4">Aucune autre catégorie disponible</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
