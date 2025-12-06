import type { Promotion, ProductWithPromotion, PriceCalculation } from '@/types/promotion';

/**
 * Calcule le prix après application de la promotion
 * IMPORTANT: Les promotions sont calculées en temps réel
 * pour s'assurer que les promotions expirées ne s'appliquent plus
 */
export function calculatePromotionPrice(
    originalPrice: number,
    promotion: Promotion | null
): PriceCalculation {
    if (!promotion || !promotion.isActive) {
        return {
            originalPrice,
            discountAmount: 0,
            finalPrice: originalPrice,
            hasPromotion: false,
        };
    }

    // Vérifier les dates en temps réel
    const now = new Date();

    if (promotion.startDate && now < new Date(promotion.startDate)) {
        return {
            originalPrice,
            discountAmount: 0,
            finalPrice: originalPrice,
            hasPromotion: false,
        };
    }

    if (promotion.endDate && now > new Date(promotion.endDate)) {
        return {
            originalPrice,
            discountAmount: 0,
            finalPrice: originalPrice,
            hasPromotion: false,
        };
    }

    let discountAmount = 0;

    if (promotion.type === 'EURO') {
        discountAmount = Number(promotion.amount);
    } else if (promotion.type === 'PERCENT') {
        discountAmount = (originalPrice * Number(promotion.amount)) / 100;
    }

    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return {
        originalPrice,
        discountAmount,
        finalPrice,
        hasPromotion: true,
        promotion,
    };
}

/**
 * Récupère la première promotion active d'un produit
 * Vérifie en temps réel si la promotion est toujours valide
 */
export function getActivePromotion(product: ProductWithPromotion): Promotion | null {
    if (!product.promotions || product.promotions.length === 0) {
        return null;
    }

    const now = new Date();

    for (const { promotion } of product.promotions) {
        if (!promotion.isActive) continue;

        if (promotion.startDate && now < new Date(promotion.startDate)) continue;
        if (promotion.endDate && now > new Date(promotion.endDate)) continue;

        return promotion;
    }

    return null;
}

/**
 * Format promotion badge text (e.g., "-5€" or "-20%")
 */
export function formatPromotionBadge(promotion: { amount: number; type: string }): string {
    if (promotion.type === 'PERCENTAGE') {
        return `-${promotion.amount}%`;
    }
    return `-${promotion.amount}€`;
}

/**
 * Vérifie si une promotion est expirée
 */
export function isPromotionExpired(promotion: { endDate?: Date | string | null }): boolean {
    if (!promotion.endDate) return false;

    const now = new Date();
    return now > new Date(promotion.endDate);
}
