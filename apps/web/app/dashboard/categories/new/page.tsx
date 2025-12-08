'use client';

import { useState, useEffect } from 'react';
import { CategoryForm } from '@/components/dashboard/CategoryForm';

export default function NewCategoryPage() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                // Flatten the hierarchical data for the form
                const flatten = (cats: any[]): any[] => {
                    return cats.reduce((acc: any[], cat: any) => {
                        return [...acc, cat, ...flatten(cat.children || [])];
                    }, []);
                };
                setCategories(flatten(data));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return <CategoryForm categories={categories} />;
}
