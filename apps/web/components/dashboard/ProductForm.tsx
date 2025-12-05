"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Package, Euro, FileText, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormSection } from "@/components/ui";
import { ProductBasicInfo } from "./product/ProductBasicInfo";
import { ProductPricing } from "./product/ProductPricing";
import { ProductMedicalInfo } from "./product/ProductMedicalInfo";
import { ProductSEO } from "./product/ProductSEO";
import { ProductCategories } from "./product/ProductCategories";
import { ProductImageUpload } from "./product/ProductImageUpload";
import { ProductStock } from "./product/ProductStock";
import { ProductStatus } from "./product/ProductStatus";

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

export default function ProductForm({ initialData, categories, brands, isEditing = false, onSubmit }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [lastEditedPrice, setLastEditedPrice] = useState<"HT" | "TTC">("HT");

    const [formData, setFormData] = useState<FormData>({
        name: "", ean: "", sku: "", description: "", shortDescription: "", slug: "", imageUrl: "",
        priceHT: "", tva: "20", priceTTC: "", stock: "0", maxOrderQuantity: "", weight: "",
        isMedicament: false, notice: "", composition: "", usageTips: "", precautions: "",
        metaTitle: "", metaDescription: "", isActive: true, position: "0",
        categoryIds: [], brandIds: [], ...initialData
    });

    useEffect(() => {
        if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
    }, [initialData]);

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
        return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    const handleFieldChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }));
    };

    const handlePriceChange = (field: 'HT' | 'TTC', value: string) => {
        setLastEditedPrice(field);
        setFormData(prev => ({ ...prev, [`price${field}`]: value }));
    };

    const toggleCategory = (categoryId: string) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));
    };

    const toggleBrand = (brandId: string) => {
        setFormData(prev => ({
            ...prev,
            brandIds: prev.brandIds.includes(brandId)
                ? prev.brandIds.filter(id => id !== brandId)
                : [...prev.brandIds, brandId]
        }));
    };

    return (
        <div className="pb-20">
            {/* Header Actions */}
            <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-md px-6 py-4 -mx-6 -mt-6 mb-8 border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/products" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900">
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
                        <Link href="/dashboard/products" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                    <FormSection icon={Package} title="Informations générales" description="Les informations de base de votre produit visible par les clients.">
                        <ProductBasicInfo formData={formData} onChange={handleFieldChange} onNameChange={handleNameChange} />
                    </FormSection>

                    <FormSection icon={Euro} title="Prix et TVA" description="Gérez la tarification de votre produit.">
                        <ProductPricing formData={formData} onChange={handleFieldChange} onPriceChange={handlePriceChange} />
                    </FormSection>

                    <FormSection icon={FileText} title="Informations médicales" description="Détails spécifiques pour les produits pharmaceutiques.">
                        <ProductMedicalInfo formData={formData} onChange={handleFieldChange} />
                    </FormSection>

                    <FormSection icon={Search} title="Optimisation SEO" description="Améliorez la visibilité de votre produit sur Google.">
                        <ProductSEO formData={formData} onChange={handleFieldChange} />
                    </FormSection>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">
                    <ProductStatus isActive={formData.isActive} onChange={(isActive) => handleFieldChange('isActive', isActive)} />
                    <ProductImageUpload imageUrl={formData.imageUrl} onChange={(url) => handleFieldChange('imageUrl', url)} />
                    <ProductCategories
                        categories={categories}
                        brands={brands}
                        selectedCategoryIds={formData.categoryIds}
                        selectedBrandIds={formData.brandIds}
                        onToggleCategory={toggleCategory}
                        onToggleBrand={toggleBrand}
                    />
                    <ProductStock formData={formData} onChange={handleFieldChange} />
                </div>
            </div>
        </div>
    );
}
