import { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    ean: string;
    imageUrl: string | null;
    priceTTC: number;
    stock: number;
    isActive: boolean;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/products?admin=true");
            const data = await response.json();
            setProducts(data.data || data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id: string) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            setProducts(products.filter((p) => p.id !== id));
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            return false;
        }
    };

    return {
        products,
        loading,
        fetchProducts,
        deleteProduct,
    };
}
