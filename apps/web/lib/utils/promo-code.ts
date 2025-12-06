import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export type PromoCodeValidationResult = {
    isValid: boolean;
    error?: string;
    promoCode?: any; // Replace with PromoCode type
};

export async function validatePromoCode(
    code: string,
    cartTotal: number,
    userId?: string
): Promise<PromoCodeValidationResult> {
    const promoCode = await prisma.promoCode.findUnique({
        where: { code },
    });

    if (!promoCode) {
        return { isValid: false, error: "Code promo invalide" };
    }

    if (!promoCode.isActive) {
        return { isValid: false, error: "Ce code promo n'est plus actif" };
    }

    const now = new Date();
    if (promoCode.startDate && now < promoCode.startDate) {
        return { isValid: false, error: "Ce code promo n'est pas encore valide" };
    }

    if (promoCode.endDate && now > promoCode.endDate) {
        return { isValid: false, error: "Ce code promo a expiré" };
    }

    // Vérifier le montant minimum
    if (promoCode.minCartAmount && cartTotal < Number(promoCode.minCartAmount)) {
        return {
            isValid: false,
            error: `Le montant minimum pour ce code est de ${Number(promoCode.minCartAmount)}€`
        };
    }

    // Vérifier la limite globale d'utilisation
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
        return { isValid: false, error: "Ce code promo a atteint sa limite d'utilisation" };
    }

    // Vérifier la limite par utilisateur
    if (userId && promoCode.perUserLimit) {
        const userUsage = await prisma.order.count({
            where: {
                userId,
                promoCodeId: promoCode.id,
            },
        });

        if (userUsage >= promoCode.perUserLimit) {
            return { isValid: false, error: "Vous avez déjà utilisé ce code promo" };
        }
    }

    return { isValid: true, promoCode };
}

export function calculateDiscount(
    cartTotal: number,
    promoCode: { discountType: 'EURO' | 'PERCENTAGE', discountAmount: Decimal | number }
): number {
    const amount = Number(promoCode.discountAmount);

    if (promoCode.discountType === 'PERCENTAGE') {
        return (cartTotal * amount) / 100;
    } else {
        return Math.min(amount, cartTotal); // Ne pas dépasser le total
    }
}
