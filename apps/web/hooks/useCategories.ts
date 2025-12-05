import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    position: number;
    menuPosition: number;
    isActive: boolean;
    children: Category[];
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');

            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error('API returned non-array data:', data);
                throw new Error('Invalid data format received');
            }

            const rootCategories = data.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
            setCategories(rootCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategory = async (id: string) => {
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchCategories();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting category:', error);
            return false;
        }
    };

    return {
        categories,
        loading,
        fetchCategories,
        deleteCategory,
    };
}
