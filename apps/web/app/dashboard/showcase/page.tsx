'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GripVertical, Eye, EyeOff, Save, Loader2, ImageIcon, X, Plus, Package } from 'lucide-react';
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
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProductPicker } from '@/components/dashboard/ProductPicker';
import { FooterSettings } from '@/components/dashboard/FooterSettings';
import { toast } from 'sonner';

// --- Types ---
interface Category {
    type: 'category';
    id: string;
    name: string;
    imageUrl: string | null;
    position: number; // For Featured (Nos Univers)
    menuPosition: number; // For Mega Menu
    searchPosition: number; // For Search
    isActive: boolean;
    children?: Category[];
}

interface Brand {
    type: 'brand';
    id: string;
    name: string;
    imageUrl: string | null;
    position: number; // For Featured (Nos Marques)
    searchPosition: number; // For Search
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

// --- Type Guards ---
function isCategory(item: ShowcaseItem): item is Category {
    return item.type === 'category';
}

function isBrand(item: ShowcaseItem): item is Brand {
    return item.type === 'brand';
}

function isFeaturedProduct(item: ShowcaseItem): item is FeaturedProduct {
    return item.type === 'product';
}

// --- Generic Sortable Item ---
function SortableItem({
    id,
    item,
    positionField,
    onToggleVisibility,
    renderContent
}: {
    id: string,
    item: ShowcaseItem,
    positionField: keyof ShowcaseItem,
    onToggleVisibility?: (id: string) => void,
    renderContent: (item: ShowcaseItem) => React.ReactNode
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Safe access to position field
    const positionValue = (item as any)[positionField] as number;
    const isVisible = positionValue > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 p-4 bg-white border rounded-xl mb-2 ${isVisible ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-75'}`}
        >
            <div {...attributes} {...listeners} className="cursor-grab hover:text-[#fe0090] text-gray-400 flex-shrink-0">
                <GripVertical size={20} />
            </div>

            <div className="flex-1 min-w-0">
                {renderContent(item)}
            </div>

            {onToggleVisibility && (
                <button
                    onClick={() => onToggleVisibility(id)}
                    className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={isVisible ? "Masquer (Position 0)" : "Afficher (Ajouter à la fin)"}
                >
                    {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
            )}
        </div>
    );
}

// --- Main Page Component ---
export default function ShowcasePage() {
    const [activeTab, setActiveTab] = useState<Tab>('mega-menu');
    const [showcaseSubTab, setShowcaseSubTab] = useState<ShowcaseSubTab>('univers');
    const [searchSubTab, setSearchSubTab] = useState<SearchSubTab>('categories');

    // Data State
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showProductPicker, setShowProductPicker] = useState(false);

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

            // Helper to flatten categories and add type
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

    // --- Helpers ---

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

    const getPositionField = (): string => {
        if (activeTab === 'mega-menu') return 'menuPosition';
        if (activeTab === 'showcase') {
            if (showcaseSubTab === 'products') return 'position'; // Products always have position
            return 'position';
        }
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

        // Update positions to reflect the new order immediately
        // This is crucial because getActiveList sorts by position. 
        // If we don't update positions, the list will revert to the old order on next render.
        const field = getPositionField();
        const isProducts = activeTab === 'showcase' && showcaseSubTab === 'products';

        let currentPos = isProducts ? 0 : 1; // Products are 0-indexed, others 1-indexed (0 is hidden)

        const updatedList = newList.map(item => {
            // For products, always update position
            if (isProducts) {
                return { ...item, [field]: currentPos++ };
            }

            // For others, only update if it's a visible item (position > 0)
            // Hidden items (position 0) stay 0 and are not reordered relative to visible ones
            if ((item as any)[field] > 0) {
                return { ...item, [field]: currentPos++ };
            }
            return item;
        });

        // Update state based on current tab and type
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

    const updateListInState = (originalList: any[], sortedSubset: any[]) => {
        // We need to merge the sorted subset back into the original list (which might contain other items not in subset if we filtered)
        // But here getActiveList returns ALL items of that type, just sorted.
        // So we can just return the sorted list? 
        // Yes, because we flattened categories.
        return sortedSubset;
    };

    const handleToggleVisibility = (id: string) => {
        const field = getPositionField();
        const list = getActiveList();

        // Calculate max position from the *current* list state to append to the end
        const maxPos = Math.max(0, ...list.map(i => (i as any)[field] as number));

        const newList = list.map(item => {
            if (item.id === id) {
                const currentVal = (item as any)[field] as number;
                if (currentVal > 0) {
                    return { ...item, [field]: 0 };
                } else {
                    return { ...item, [field]: maxPos + 1 };
                }
            }
            return item;
        });

        // Update state
        if (activeTab === 'mega-menu') setCategories(newList as Category[]);
        else if (activeTab === 'showcase') {
            if (showcaseSubTab === 'univers') setCategories(newList as Category[]);
            if (showcaseSubTab === 'brands') setBrands(newList as Brand[]);
        }
        else if (activeTab === 'search') {
            if (searchSubTab === 'categories') setCategories(newList as Category[]);
            if (searchSubTab === 'brands') setBrands(newList as Brand[]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const field = getPositionField();
            const list = getActiveList();

            // Re-calculate positions for visible items (1, 2, 3...)
            let currentPos = 1;
            const updates = list.map(item => {
                let newPos = (item as any)[field];
                if ((item as any)[field] > 0) {
                    newPos = currentPos++;
                }
                return {
                    id: item.id,
                    [field]: newPos
                };
            });

            // Determine endpoint
            let endpoint = '';
            if (activeTab === 'mega-menu') endpoint = '/api/categories'; // Uses menuPosition
            else if (activeTab === 'showcase') {
                if (showcaseSubTab === 'univers') endpoint = '/api/categories';
                if (showcaseSubTab === 'brands') endpoint = '/api/brands';
                if (showcaseSubTab === 'products') endpoint = '/api/featured-products';
            }
            else if (activeTab === 'search') {
                if (searchSubTab === 'categories') endpoint = '/api/categories/search';
                if (searchSubTab === 'brands') endpoint = '/api/brands/search';
            }

            // Special case for Featured Products (structure is different)
            if (activeTab === 'showcase' && showcaseSubTab === 'products') {
                const productUpdates = list.map((p, index) => ({
                    id: p.id,
                    position: index,
                }));
                await fetch(endpoint, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ updates: productUpdates }),
                });
            } else {
                // Generic update
                await fetch(endpoint, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ updates }),
                });
            }

            toast.success('Modifications enregistrées !');
            // Refresh data to be sure
            await fetchData();

        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    // --- Render Content Helpers ---
    const renderCategoryContent = (item: ShowcaseItem) => {
        if (!isCategory(item)) return null;
        return (
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                    )}
                </div>
                <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Position: {(item as any)[getPositionField()]}</p>
                </div>
            </div>
        );
    };

    const renderBrandContent = (item: ShowcaseItem) => {
        if (!isBrand(item)) return null;
        return (
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 bg-white">
                    {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={20} /></div>
                    )}
                </div>
                <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Position: {(item as any)[getPositionField()]}</p>
                </div>
            </div>
        );
    };

    const renderProductContent = (item: ShowcaseItem) => {
        if (!isFeaturedProduct(item)) return null;
        const imageUrl = item.product.images[0]?.url || item.product.imageUrl;
        return (
            <div className="flex items-center gap-4 w-full">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {imageUrl ? (
                        <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={20} /></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm font-bold text-[#fe0090]">{Number(item.product.priceTTC).toFixed(2)} €</p>
                </div>
                <button
                    onClick={() => handleRemoveProduct(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        );
    };

    const handleRemoveProduct = async (id: string) => {
        if (!confirm('Retirer ce produit ?')) return;
        try {
            await fetch(`/api/featured-products/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleAddProducts = async (ids: string[]) => {
        try {
            for (const id of ids) {
                await fetch('/api/featured-products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: id }),
                });
            }
            fetchData();
            setShowProductPicker(false);
        } catch (e) { console.error(e); }
    };

    // --- Derived State for View ---
    const activeList = getActiveList();
    const positionField = getPositionField();
    const visibleItems = activeList.filter(i => (i as any)[positionField] > 0);
    const hiddenItems = activeList.filter(i => (i as any)[positionField] === 0);

    // Products don't have "hidden" logic in the same way (they are just in the list or not), 
    // but let's assume all in list are visible for products tab.
    const isProductTab = activeTab === 'showcase' && showcaseSubTab === 'products';

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion de la Vitrine</h1>
                    <p className="text-sm text-gray-500">Gérez l'affichage et l'ordre des éléments sur le site</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#fe0090] text-white rounded-xl hover:bg-[#fe0090]/90 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 font-medium"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Sauvegarder l'ordre
                </button>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
                {[
                    { id: 'mega-menu', label: 'Mega Menu' },
                    { id: 'showcase', label: 'Mise en avant (Accueil)' },
                    { id: 'search', label: 'Barre de recherche' },
                    { id: 'footer', label: 'Footer' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === tab.id
                            ? 'border-[#fe0090] text-[#fe0090]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub Tabs */}
            {activeTab === 'showcase' && (
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'univers', label: 'Nos Univers' },
                        { id: 'brands', label: 'Nos Marques' },
                        { id: 'products', label: 'Sélection Pharmacien' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setShowcaseSubTab(tab.id as ShowcaseSubTab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showcaseSubTab === tab.id
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {activeTab === 'search' && (
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'categories', label: 'Catégories' },
                        { id: 'brands', label: 'Marques' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSearchSubTab(tab.id as SearchSubTab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${searchSubTab === tab.id
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Footer Tab Content */}
            {activeTab === 'footer' && (
                <FooterSettings />
            )}

            {/* Content */}
            {activeTab !== 'footer' && (loading ? (
                <div className="p-12 text-center text-gray-500">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visible / Active List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Eye size={20} className="text-green-600" />
                                Visibles ({isProductTab ? activeList.length : visibleItems.length})
                            </h2>
                            {isProductTab && (
                                <button
                                    onClick={() => setShowProductPicker(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                                >
                                    <Plus size={16} /> Ajouter
                                </button>
                            )}
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={(isProductTab ? activeList : visibleItems).map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {(isProductTab ? activeList : visibleItems).map(item => (
                                        <SortableItem
                                            key={item.id}
                                            id={item.id}
                                            item={item}
                                            positionField={positionField as keyof ShowcaseItem}
                                            onToggleVisibility={!isProductTab ? handleToggleVisibility : undefined}
                                            renderContent={
                                                activeTab === 'showcase' && showcaseSubTab === 'products' ? renderProductContent :
                                                    (activeTab === 'showcase' && showcaseSubTab === 'brands') || (activeTab === 'search' && searchSubTab === 'brands') ? renderBrandContent :
                                                        renderCategoryContent
                                            }
                                        />
                                    ))}
                                    {(isProductTab ? activeList : visibleItems).length === 0 && (
                                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                            Aucun élément visible
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Hidden List (Not for products) */}
                    {!isProductTab && (
                        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <EyeOff size={20} className="text-gray-400" />
                                Masqués ({hiddenItems.length})
                            </h2>
                            <div className="space-y-2">
                                {hiddenItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl opacity-75 hover:opacity-100 transition-opacity">
                                        <div className="w-8"></div> {/* Spacer for grip */}
                                        <div className="flex-1 min-w-0">
                                            {(activeTab === 'showcase' && showcaseSubTab === 'brands') || (activeTab === 'search' && searchSubTab === 'brands')
                                                ? renderBrandContent(item)
                                                : renderCategoryContent(item)
                                            }
                                        </div>
                                        <button
                                            onClick={() => handleToggleVisibility(item.id)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Afficher"
                                        >
                                            <EyeOff size={20} />
                                        </button>
                                    </div>
                                ))}
                                {hiddenItems.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        Tous les éléments sont visibles
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Product Picker Modal */}
            {showProductPicker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Ajouter des produits</h2>
                            <button onClick={() => setShowProductPicker(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            <ProductPicker
                                selectedProductIds={featuredProducts.map(fp => fp.productId)}
                                onChange={handleAddProducts}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
