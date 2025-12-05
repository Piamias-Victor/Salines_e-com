import { useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { toast } from 'sonner';

interface Category {
    type: 'category';
    id: string;
    name: string;
    imageUrl: string | null;
    position: number;
    menuPosition: number;
    searchPosition: number;
    isActive: boolean;
    children?: Category[];
}

interface Brand {
    type: 'brand';
    id: string;
    name: string;
    imageUrl: string | null;
    position: number;
    searchPosition: number;
    isActive: boolean;
}

interface FeaturedProduct {
    type: 'product';
    id: string;
    productId: string;
    position: number;
    product: {
        id: string;
        name: string;
        imageUrl: string | null;
        priceTTC: number;
        images: { url: string }[];
    };
}

type ShowcaseItem = Category | Brand | FeaturedProduct;
type Tab = 'mega-menu' | 'showcase' | 'search' | 'footer';
type ShowcaseSubTab = 'univers' | 'brands' | 'products';
type SearchSubTab = 'categories' | 'brands';

export function useShowcase() {
    const [activeTab, setActiveTab] = useState<Tab>('mega-menu');
    const [showcaseSubTab, setShowcaseSubTab] = useState<ShowcaseSubTab>('univers');
    const [searchSubTab, setSearchSubTab] = useState<SearchSubTab>('categories');

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catsRes, brandsRes, prodsRes] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/brands'),
                fetch('/api/featured-products')
            ]);

            const catsData = await catsRes.json();
            const brandsData = await brandsRes.json();
            const prodsData = await prodsRes.json();

            const flatten = (list: any[]): Category[] => {
                let result: Category[] = [];
                list.forEach(item => {
                    const cat: Category = { ...item, type: 'category' };
                    result.push(cat);
                    if (item.children) result = result.concat(flatten(item.children));
                });
                return result;
            };

            setCategories(flatten(catsData));
            setBrands(brandsData.map((b: any) => ({ ...b, type: 'brand' })));
            setFeaturedProducts(prodsData.map((p: any) => ({ ...p, type: 'product' })));

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const sortByPosition = (field: string) => (a: any, b: any) => {
        if (a[field] === 0 && b[field] === 0) return a.name.localeCompare(b.name);
        if (a[field] === 0) return 1;
        if (b[field] === 0) return -1;
        return a[field] - b[field];
    };

    const getActiveList = (): ShowcaseItem[] => {
        if (activeTab === 'mega-menu') {
            return [...categories].sort(sortByPosition('menuPosition'));
        }
        if (activeTab === 'showcase') {
            if (showcaseSubTab === 'univers') return [...categories].sort(sortByPosition('position'));
            if (showcaseSubTab === 'brands') return [...brands].sort(sortByPosition('position'));
            if (showcaseSubTab === 'products') return [...featuredProducts].sort((a, b) => a.position - b.position);
        }
        if (activeTab === 'search') {
            if (searchSubTab === 'categories') return [...categories].sort(sortByPosition('searchPosition'));
            if (searchSubTab === 'brands') return [...brands].sort(sortByPosition('searchPosition'));
        }
        return [];
    };

    const getPositionField = (): string => {
        if (activeTab === 'mega-menu') return 'menuPosition';
        if (activeTab === 'showcase') return 'position';
        if (activeTab === 'search') return 'searchPosition';
        return 'position';
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const list = getActiveList();
        const oldIndex = list.findIndex((item) => item.id === active.id);
        const newIndex = list.findIndex((item) => item.id === over.id);

        const newList = arrayMove(list, oldIndex, newIndex);
        const field = getPositionField();
        const isProducts = activeTab === 'showcase' && showcaseSubTab === 'products';

        let currentPos = isProducts ? 0 : 1;

        const updatedList = newList.map(item => {
            if (isProducts) {
                return { ...item, [field]: currentPos++ };
            }
            if ((item as any)[field] > 0) {
                return { ...item, [field]: currentPos++ };
            }
            return item;
        });

        if (activeTab === 'mega-menu') {
            setCategories(updatedList as Category[]);
        }
        else if (activeTab === 'showcase') {
            if (showcaseSubTab === 'univers') setCategories(updatedList as Category[]);
            if (showcaseSubTab === 'brands') setBrands(updatedList as Brand[]);
            if (showcaseSubTab === 'products') setFeaturedProducts(updatedList as FeaturedProduct[]);
        }
        else if (activeTab === 'search') {
            if (searchSubTab === 'categories') setCategories(updatedList as Category[]);
            if (searchSubTab === 'brands') setBrands(updatedList as Brand[]);
        }
    };

    const handleToggleVisibility = (id: string) => {
        const field = getPositionField();
        const list = getActiveList();

        const maxPosition = Math.max(...list.map((item: any) => item[field] || 0), 0);
        const itemIndex = list.findIndex(item => item.id === id);
        if (itemIndex === -1) return;

        const item = list[itemIndex];
        const currentPosition = (item as any)[field];
        const newPosition = currentPosition > 0 ? 0 : maxPosition + 1;

        const updatedList = list.map(i => i.id === id ? { ...i, [field]: newPosition } : i);

        if (activeTab === 'mega-menu') {
            setCategories(updatedList as Category[]);
        }
        else if (activeTab === 'showcase') {
            if (showcaseSubTab === 'univers') setCategories(updatedList as Category[]);
            if (showcaseSubTab === 'brands') setBrands(updatedList as Brand[]);
        }
        else if (activeTab === 'search') {
            if (searchSubTab === 'categories') setCategories(updatedList as Category[]);
            if (searchSubTab === 'brands') setBrands(updatedList as Brand[]);
        }
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            await Promise.all([
                fetch('/api/categories/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ categories }),
                }),
                fetch('/api/brands/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ brands }),
                }),
                fetch('/api/featured-products/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ products: featuredProducts }),
                }),
            ]);

            toast.success('Modifications enregistrées avec succès !');
        } catch (error) {
            console.error('Error saving changes:', error);
            toast.error('Erreur lors de l\'enregistrement');
        } finally {
            setSaving(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        showcaseSubTab,
        setShowcaseSubTab,
        searchSubTab,
        setSearchSubTab,
        categories,
        brands,
        featuredProducts,
        setFeaturedProducts,
        loading,
        saving,
        getActiveList,
        getPositionField,
        handleDragEnd,
        handleToggleVisibility,
        saveChanges,
        fetchData,
    };
}
