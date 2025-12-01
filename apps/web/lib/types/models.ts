// ============================================================================
// Database Models - Types correspondant aux modèles Prisma
// ============================================================================

export interface Brand {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    position: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    position: number;
    menuPosition: number;
    highlightColor: string | null;
    highlightTextColor: string | null;
    isActive: boolean;
    featuredLinks: any | null;
    children?: Category[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    ean: string;
    description: string | null;
    slug: string;
    imageUrl: string | null;
    priceHT: number;
    priceTTC: number;
    tva: number;
    stock: number;
    weight: number | null;
    maxOrderQuantity: number | null;
    isActive: boolean;
    position: number;
    promotionId: string | null;
    createdAt: Date;
    updatedAt: Date;
    images?: { url: string }[];
    brand?: Brand;
    brands?: { brand: Brand }[];
}

export interface Promotion {
    id: string;
    title: string;
    imageUrl: string;
    amount: number;
    type: 'EURO' | 'PERCENT' | 'PERCENTAGE' | 'FIXED';
    redirectUrl: string;
    position: number;
    isActive: boolean;
    startDate: Date | null;
    endDate: Date | null;
    buttonText?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Banner {
    id: string;
    title: string;
    alt: string;
    imageUrl: string;
    redirectUrl: string | null;
    position: number;
    isActive: boolean;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// UI-specific Types
// ============================================================================

export interface CarouselItem {
    id: string;
    name?: string;
    title?: string;
    imageUrl: string | null;
    slug?: string;
    redirectUrl?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type ApiResponse<T> = {
    data: T;
    error: null;
} | {
    data: null;
    error: string;
};

export interface PaginationParams {
    limit?: number;
    offset?: number;
}

export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
