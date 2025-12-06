export type PromotionType = 'EURO' | 'PERCENT';

export interface Promotion {
    id: string;
    title: string;
    amount: number;
    type: PromotionType;
    isActive: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
}

export interface ProductWithPromotion {
    id: string;
    name: string;
    priceTTC: number | string; // Can be Decimal from Prisma
    promotions?: {
        promotion: Promotion;
    }[];
}

export interface PriceCalculation {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    hasPromotion: boolean;
    promotion?: Promotion;
}
