import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { ShowcaseItem, Category, Brand, FeaturedProduct, Tab, ShowcaseSubTab, SearchSubTab } from '@/lib/types/showcase';

interface UseShowcaseDragDropProps {
    activeTab: Tab;
    showcaseSubTab: ShowcaseSubTab;
    searchSubTab: SearchSubTab;
    categories: Category[];
    brands: Brand[];
    featuredProducts: FeaturedProduct[];
    setCategories: (categories: Category[]) => void;
    setBrands: (brands: Brand[]) => void;
    setFeaturedProducts: (products: FeaturedProduct[]) => void;
}

export function useShowcaseDragDrop({
    activeTab,
    showcaseSubTab,
    searchSubTab,
    categories,
    brands,
    featuredProducts,
    setCategories,
    setBrands,
    setFeaturedProducts,
}: UseShowcaseDragDropProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const sortByPosition = (field: string) => (a: any, b: any) => {
        if (a[field] === 0 && b[field] === 0) return a.name.localeCompare(b.name);
        if (a[field] === 0) return 1;
        if (b[field] === 0) return -1;
        return a[field] - b[field];
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const list = getActiveList();
        const oldIndex = list.findIndex((item) => item.id === active.id);
        const newIndex = list.findIndex((item) => item.id === over.id);

        const newList = arrayMove(list, oldIndex, newIndex);

        // Update positions
        const positionField = getPositionField();
        const updatedList = newList.map((item, index) => ({
            ...item,
            [positionField]: (item as any)[positionField] === 0 ? 0 : index + 1,
        }));

        // Update state
        if (activeTab === 'mega-menu') setCategories(updatedList as Category[]);
        else if (activeTab === 'showcase') {
            if (showcaseSubTab === 'univers') setCategories(updatedList as Category[]);
            if (showcaseSubTab === 'brands') setBrands(updatedList as Brand[]);
            if (showcaseSubTab === 'products') setFeaturedProducts(updatedList as FeaturedProduct[]);
        } else if (activeTab === 'search') {
            if (searchSubTab === 'categories') setCategories(updatedList as Category[]);
            if (searchSubTab === 'brands') setBrands(updatedList as Brand[]);
        }
    };

    const getPositionField = (): string => {
        if (activeTab === 'mega-menu') return 'menuPosition';
        if (activeTab === 'showcase') return 'position';
        if (activeTab === 'search') return 'searchPosition';
        return 'position';
    };

    return {
        sensors,
        handleDragEnd,
        getActiveList,
        getPositionField,
    };
}
