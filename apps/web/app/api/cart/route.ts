import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cartService, CART_COOKIE_NAME } from '@/lib/services/cart';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // TODO: Get real user ID from auth session
        const userId = undefined;
        const cart = await cartService.getCart(userId);

        if (!cart) {
            return NextResponse.json({ items: [] });
        }

        // Clean expired promotions
        await cartService.cleanExpiredPromotions(cart.id);

        let promoCodeDetails = null;
        if (cart.appliedPromoCode) {
            promoCodeDetails = await prisma.promoCode.findUnique({
                where: { code: cart.appliedPromoCode },
            });
        }

        // Serialize Decimal fields for JSON response
        const serializedCart = {
            ...cart,
            items: cart.items.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    priceTTC: Number(item.product.priceTTC),
                    weight: item.product.weight ? Number(item.product.weight) : null,
                },
                appliedPromotionPrice: item.appliedPromotionPrice ? Number(item.appliedPromotionPrice) : null,
                appliedPromotion: item.appliedPromotion ? {
                    ...item.appliedPromotion,
                    amount: Number(item.appliedPromotion.amount),
                } : null,
            })),
            promoCode: promoCodeDetails ? {
                ...promoCodeDetails,
                discountAmount: Number(promoCodeDetails.discountAmount),
                minCartAmount: promoCodeDetails.minCartAmount ? Number(promoCodeDetails.minCartAmount) : null,
                freeShippingMethodId: promoCodeDetails.freeShippingMethodId,
            } : null,
        };

        return NextResponse.json(serializedCart);
    } catch (error) {
        console.error('[CART_GET]', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, quantity } = body;

        if (!productId || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Handle Session Cookie
        const cookieStore = await cookies();
        let sessionToken = cookieStore.get(CART_COOKIE_NAME)?.value;
        let isNewSession = false;

        if (!sessionToken) {
            sessionToken = crypto.randomUUID();
            isNewSession = true;
        }

        // TODO: Get real user ID
        const userId = undefined;

        // Add to cart
        const cartItem = await cartService.addToCart(productId, quantity, userId, sessionToken);

        // Set cookie if new session
        if (isNewSession) {
            cookieStore.set(CART_COOKIE_NAME, sessionToken!, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }

        return NextResponse.json(cartItem);
    } catch (error: any) {
        console.error('[CART_POST]', error);
        return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { shippingMethodId } = body;

        // Handle Session Cookie
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(CART_COOKIE_NAME)?.value;

        // TODO: Get real user ID
        const userId = undefined;

        if (!sessionToken && !userId) {
            return NextResponse.json({ error: 'No active cart' }, { status: 404 });
        }

        const cart = await cartService.getCart(userId);

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        // Update cart
        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                shippingMethodId: shippingMethodId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedCart);
    } catch (error: any) {
        console.error('[CART_PATCH]', error);
        return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
    }
}
