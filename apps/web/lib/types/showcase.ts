// Showcase Types
export interface Category {
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

export interface Brand {
    type: 'brand';
    id: string;
    name: string;
    imageUrl: string | null;
    position: number;
    searchPosition: number;
    isActive: boolean;
}

export interface FeaturedProduct {
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

export type ShowcaseItem = Category | Brand | FeaturedProduct;

export type Tab = 'mega-menu' | 'showcase' | 'search' | 'footer';
export type ShowcaseSubTab = 'univers' | 'brands' | 'products';
export type SearchSubTab = 'categories' | 'brands';

// Type Guards
export function isCategory(item: ShowcaseItem): item is Category {
    return item.type === 'category';
}

export function isBrand(item: ShowcaseItem): item is Brand {
    return item.type === 'brand';
}

export function isFeaturedProduct(item: ShowcaseItem): item is FeaturedProduct {
    return item.type === 'product';
}
