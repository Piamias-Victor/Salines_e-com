"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Loader2,
    Info,
    Image as ImageIcon,
    Euro,
    Package,
    FileText,
    Search,
    ArrowLeft,
    Check
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Category {
    id: string;
    name: string;
}

interface Brand {
    id: string;
    name: string;
}

interface FormData {
    name: string;
    ean: string;
    sku: string;
    description: string;
    shortDescription: string;
    slug: string;
    imageUrl: string;
    priceHT: string;
    tva: string;
    priceTTC: string;
    stock: string;
    maxOrderQuantity: string;
    weight: string;
    isMedicament: boolean;
    notice: string;
    composition: string;
    usageTips: string;
    precautions: string;
    metaTitle: string;
    metaDescription: string;
    isActive: boolean;
    position: string;
    categoryIds: string[];
    brandIds: string[];
}

interface ProductFormProps {
    initialData?: Partial<FormData>;
    categories: Category[];
    brands: Brand[];
    isEditing?: boolean;
    onSubmit: (data: FormData) => Promise<void>;
}

export default function ProductForm({
    initialData,
    categories,
    brands,
    isEditing = false,
    onSubmit
}: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        ean: "",
        sku: "",
        description: "",
        shortDescription: "",
        slug: "",
        imageUrl: "",
        priceHT: "",
        tva: "20",
        priceTTC: "",
        stock: "0",
        maxOrderQuantity: "",
        weight: "",
        isMedicament: false,
        notice: "",
        composition: "",
        usageTips: "",
        precautions: "",
        metaTitle: "",
        metaDescription: "",
        isActive: true,
        position: "0",
        categoryIds: [],
        brandIds: [],
        ...initialData
    });

    const [lastEditedPrice, setLastEditedPrice] = useState<"HT" | "TTC">("HT");

    // Initialize form data if initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    // Bidirectional price calculation
    useEffect(() => {
        const tva = parseFloat(formData.tva);
        if (isNaN(tva)) return;

        if (lastEditedPrice === "HT" && formData.priceHT) {
            const ht = parseFloat(formData.priceHT);
            if (!isNaN(ht)) {
                const ttc = ht * (1 + tva / 100);
                setFormData(prev => ({ ...prev, priceTTC: ttc.toFixed(2) }));
            }
        } else if (lastEditedPrice === "TTC" && formData.priceTTC) {
            const ttc = parseFloat(formData.priceTTC);
            if (!isNaN(ttc)) {
                const ht = ttc / (1 + tva / 100);
                setFormData(prev => ({ ...prev, priceHT: ht.toFixed(2) }));
            }
        }
    }, [formData.priceHT, formData.priceTTC, formData.tva, lastEditedPrice]);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    const toggleCategory = (categoryId: string) => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter((id) => id !== categoryId)
                : [...prev.categoryIds, categoryId],
        }));
    };

    const toggleBrand = (brandId: string) => {
        setFormData((prev) => ({
            ...prev,
            brandIds: prev.brandIds.includes(brandId)
                ? prev.brandIds.filter((id) => id !== brandId)
                : [...prev.brandIds, brandId],
        }));
    };

    // Helper components
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

    const Tooltip = ({ content }: { content: string }) => (
        <div className="group relative inline-block ml-2 align-middle">
            <Info size={14} className="text-gray-400 hover:text-[#fe0090] cursor-help transition-colors" />
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 transition-all duration-200 pointer-events-none leading-relaxed">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
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
                            href="/dashboard/products"
                            className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditing ? "Modifier le produit" : "Nouveau produit"}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {isEditing ? "Mettez à jour les informations du produit" : "Ajoutez un nouveau produit au catalogue"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/products"
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
                            icon={Package}
                            title="Informations générales"
                            description="Les informations de base de votre produit visible par les clients."
                        />

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Nom du produit
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
                                    placeholder="Ex: Doliprane 1000mg"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Code EAN
                                        <Tooltip content="Le code-barres unique du produit (13 chiffres)" />
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.ean}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ean: e.target.value }))}
                                        placeholder="34009..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        SKU (Référence interne)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        placeholder="REF-001"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description courte
                                    <Tooltip content="Un résumé accrocheur affiché dans les listes de produits" />
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description complète
                                </label>
                                <textarea
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
                        <SectionHeader
                            icon={Euro}
                            title="Prix et TVA"
                            description="Gérez la tarification de votre produit."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Prix HT
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.priceHT}
                                        onChange={(e) => {
                                            setLastEditedPrice("HT");
                                            setFormData(prev => ({ ...prev, priceHT: e.target.value }));
                                        }}
                                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    TVA
                                </label>
                                <select
                                    value={formData.tva}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tva: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="20">20% (Standard)</option>
                                    <option value="10">10% (Intermédiaire)</option>
                                    <option value="5.5">5.5% (Réduit)</option>
                                    <option value="2.1">2.1% (Super réduit)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Prix TTC
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.priceTTC}
                                        onChange={(e) => {
                                            setLastEditedPrice("TTC");
                                            setFormData(prev => ({ ...prev, priceTTC: e.target.value }));
                                        }}
                                        className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all font-semibold text-gray-900"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
                        <SectionHeader
                            icon={FileText}
                            title="Informations médicales"
                            description="Détails spécifiques pour les produits pharmaceutiques."
                        />

                        <div className="space-y-6">
                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isMedicament ? 'bg-[#fe0090]' : 'bg-gray-200'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.isMedicament ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isMedicament}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        isMedicament: e.target.checked,
                                        maxOrderQuantity: e.target.checked ? "6" : prev.maxOrderQuantity
                                    }))}
                                    className="hidden"
                                />
                                <div>
                                    <span className="font-medium text-gray-900">C'est un médicament</span>
                                    <p className="text-xs text-gray-500">Limite la commande à 6 unités et active le champ notice</p>
                                </div>
                            </label>

                            {formData.isMedicament && (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Lien de la notice (URL PDF) *
                                    </label>
                                    <input
                                        type="url"
                                        required={formData.isMedicament}
                                        value={formData.notice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notice: e.target.value }))}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Composition</label>
                                    <textarea
                                        rows={3}
                                        value={formData.composition}
                                        onChange={(e) => setFormData(prev => ({ ...prev, composition: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Conseils d'utilisation</label>
                                    <textarea
                                        rows={3}
                                        value={formData.usageTips}
                                        onChange={(e) => setFormData(prev => ({ ...prev, usageTips: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
                        <SectionHeader
                            icon={Search}
                            title="Optimisation SEO"
                            description="Améliorez la visibilité de votre produit sur Google."
                        />

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Meta Titre
                                    <Tooltip content="Le titre qui apparaît en bleu dans les résultats Google. Idéalement entre 50 et 60 caractères." />
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all pr-16"
                                    />
                                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.metaTitle.length}/60
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Meta Description
                                    <Tooltip content="Le petit texte sous le titre dans Google. Doit donner envie de cliquer. Idéalement entre 150 et 160 caractères." />
                                </label>
                                <div className="relative">
                                    <textarea
                                        rows={3}
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] transition-all"
                                    />
                                    <span className={`absolute right-3 bottom-3 text-xs ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.metaDescription.length}/160
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Slug URL
                                    <Tooltip content="L'adresse web de la page produit. Doit être unique et contenir des mots-clés." />
                                </label>
                                <div className="flex items-center">
                                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2.5 text-gray-500 text-sm">
                                        /produits/
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

                    {/* Status Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">État du produit</h3>
                        <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${formData.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div>
                                <span className={`block font-medium ${formData.isActive ? 'text-green-700' : 'text-gray-700'}`}>
                                    {formData.isActive ? 'En ligne' : 'Hors ligne'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formData.isActive ? 'Visible par les clients' : 'Caché de la boutique'}
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
                    </div>

                    {/* Image Upload Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Image principale</h3>
                        <div className="space-y-4">
                            <div className="relative rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center group hover:border-[#fe0090] transition-colors h-48 w-full">
                                {formData.imageUrl ? (
                                    <Image
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-contain p-2"
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon className="mx-auto h-8 w-8 text-gray-300 group-hover:text-[#fe0090] transition-colors" />
                                        <p className="mt-2 text-xs text-gray-500">Aperçu de l'image</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                            />
                        </div>
                    </div>

                    {/* Categories Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {categories.map((cat) => {
                                const isSelected = formData.categoryIds.includes(cat.id);
                                return (
                                    <label
                                        key={cat.id}
                                        className={`flex items-center justify-center text-center p-2 rounded-lg cursor-pointer transition-all border text-xs font-medium ${isSelected
                                            ? 'bg-pink-50 border-[#fe0090] text-[#fe0090]'
                                            : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="hidden"
                                        />
                                        {cat.name}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Brands Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Marque</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {brands.map((brand) => {
                                const isSelected = formData.brandIds.includes(brand.id);
                                return (
                                    <label
                                        key={brand.id}
                                        className={`flex items-center justify-center text-center p-2 rounded-lg cursor-pointer transition-all border text-xs font-medium ${isSelected
                                            ? 'bg-pink-50 border-[#fe0090] text-[#fe0090]'
                                            : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleBrand(brand.id)}
                                            className="hidden"
                                        />
                                        {brand.name}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stock Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Stock & Livraison</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Stock disponible</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Limite de commande
                                    {formData.isMedicament && <span className="text-[#fe0090] ml-1">(Fixé à 6 pour les médicaments)</span>}
                                </label>
                                <input
                                    type="number"
                                    value={formData.maxOrderQuantity}
                                    disabled={formData.isMedicament}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maxOrderQuantity: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090] disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Poids (kg)</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    value={formData.weight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
