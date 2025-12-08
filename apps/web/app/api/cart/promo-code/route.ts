import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cartService } from '@/lib/services/cart';
import { validatePromoCode } from '@/lib/utils/promo-code';

export async function POST(req: Request) {
    try {
        const { code } = await req.json();
        const cart = await cartService.getCart();

        if (!cart) {
            return NextResponse.json({ error: "Panier introuvable" }, { status: 404 });
        }

        if (!code) {
            return NextResponse.json({ error: "Code requis" }, { status: 400 });
        }

        // Calculer le total du panier (après promotions produits)
        const cartTotal = cart.items.reduce((acc: number, item: any) => {
            const price = item.appliedPromotionPrice
                ? Number(item.appliedPromotionPrice)
                : Number(item.product.priceTTC);
            return acc + (price * item.quantity);
        }, 0);

        // Valider le code
        const validation = await validatePromoCode(code, cartTotal, cart.userId || undefined);

        if (!validation.isValid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Appliquer le code au panier
        await prisma.cart.update({
            where: { id: cart.id },
            data: { appliedPromoCode: code },
        });

        return NextResponse.json({
            success: true,
            message: "Code promo appliqué",
            promoCode: validation.promoCode
        });

    } catch (error) {
        console.error('[CART_PROMO_POST]', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const cart = await cartService.getCart();

        if (!cart) {
            return NextResponse.json({ error: "Panier introuvable" }, { status: 404 });
        }

        await prisma.cart.update({
            where: { id: cart.id },
            data: { appliedPromoCode: null },
        });

        return NextResponse.json({ success: true, message: "Code promo retiré" });

    } catch (error) {
        console.error('[CART_PROMO_DELETE]', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
