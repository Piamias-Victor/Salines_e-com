"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/dashboard/ProductForm";

interface Category {
    id: string;
    name: string;
}

interface Brand {
    id: string;
    name: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/brands"),
                ]);
                const categoriesData = await categoriesRes.json();
                const brandsData = await brandsRes.json();
                setCategories(categoriesData);
                setBrands(brandsData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Impossible de charger les données nécessaires.");
            }
        }
        fetchData();
    }, []);

    const handleCreate = async (formData: any) => {
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create product");
            }

            router.push("/dashboard/products");
        } catch (err: any) {
            console.error("Error creating product:", err);
            alert(err.message); // Simple alert for now, or could pass error back to form
        }
    };

    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <ProductForm
            categories={categories}
            brands={brands}
            onSubmit={handleCreate}
        />
    );
}
