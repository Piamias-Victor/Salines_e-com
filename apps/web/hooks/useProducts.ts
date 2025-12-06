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

export function useProducts({
    page = 1,
    limit = 20,
    search = ""
}: {
    page?: number;
    limit?: number;
    search?: string;
} = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                admin: "true",
                page: page.toString(),
                limit: limit.toString(),
            });

            if (search) {
                params.append("search", search);
            }

            const response = await fetch(`/api/products?${params.toString()}`);
            const data = await response.json();

            setProducts(data.data || []);
            if (data.pagination) {
                setTotal(data.pagination.total);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, limit, search]);

    const deleteProduct = async (id: string) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            // Refresh the list to maintain correct pagination
            fetchProducts();
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            return false;
        }
    };

    return {
        products,
        loading,
        total,
        totalPages,
        fetchProducts,
        deleteProduct,
    };
}
