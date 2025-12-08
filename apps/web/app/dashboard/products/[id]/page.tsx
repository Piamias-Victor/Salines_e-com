"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/dashboard/ProductForm";

interface Category {
    id: string;
    name: string;
}

interface Brand {
    id: string;
    name: string;
}

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [error, setError] = useState("");
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productRes, categoriesRes, brandsRes] = await Promise.all([
                    fetch(`/api/products/${params.id}`),
                    fetch("/api/categories"),
                    fetch("/api/brands"),
                ]);

                if (!productRes.ok) throw new Error("Product not found");

                const product = await productRes.json();
                const categoriesData = await categoriesRes.json();
                const brandsData = await brandsRes.json();

                setCategories(categoriesData);
                setBrands(brandsData);

                // Format product data for the form
                setInitialData({
                    name: product.name || "",
                    ean: product.ean || "",
                    sku: product.sku || "",
                    description: product.description || "",
                    shortDescription: product.shortDescription || "",
                    slug: product.slug || "",
                    imageUrl: product.imageUrl || product.images?.[0]?.url || "",
                    priceHT: product.priceHT?.toString() || "",
                    tva: product.tva?.toString() || "20",
                    priceTTC: product.priceTTC?.toString() || "",
                    stock: product.stock?.toString() || "0",
                    maxOrderQuantity: product.maxOrderQuantity?.toString() || "",
                    weight: product.weight?.toString() || "",
                    isMedicament: product.isMedicament || false,
                    notice: product.notice || "",
                    composition: product.composition || "",
                    usageTips: product.usageTips || "",
                    precautions: product.precautions || "",
                    metaTitle: product.metaTitle || "",
                    metaDescription: product.metaDescription || "",
                    isActive: product.isActive !== undefined ? product.isActive : true,
                    position: product.position?.toString() || "0",
                    categoryIds: product.categories?.map((c: any) => c.categoryId) || [],
                    brandIds: product.brands?.map((b: any) => b.brandId) || [],
                });

                setFetching(false);
            } catch (err: any) {
                setError(err.message);
                setFetching(false);
            }
        }
        fetchData();
    }, [params.id]);

    const handleUpdate = async (formData: any) => {
        try {
            const response = await fetch(`/api/products/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update product");
            }

            router.push("/dashboard/products");
        } catch (err: any) {
            console.error("Error updating product:", err);
            alert(err.message);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <ProductForm
            initialData={initialData}
            categories={categories}
            brands={brands}
            isEditing={true}
            onSubmit={handleUpdate}
        />
    );
}
