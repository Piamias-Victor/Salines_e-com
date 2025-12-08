'use client';

import { useState, useEffect, use } from 'react';
import { CategoryForm } from '@/components/dashboard/CategoryForm';
import { Loader2 } from 'lucide-react';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [category, setCategory] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, allCatsRes] = await Promise.all([
                    fetch(`/api/categories/${id}`),
                    fetch('/api/categories')
                ]);

                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategory(catData);
                }

                if (allCatsRes.ok) {
                    const allData = await allCatsRes.json();
                    const flatten = (cats: any[]): any[] => {
                        return cats.reduce((acc: any[], cat: any) => {
                            return [...acc, cat, ...flatten(cat.children || [])];
                        }, []);
                    };
                    setCategories(flatten(allData));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#fe0090]" size={32} />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="text-center py-20 text-gray-500">
                Catégorie introuvable
            </div>
        );
    }

    return (
        <CategoryForm
            initialData={category}
            categories={categories}
            isEditing={true}
        />
    );
}
