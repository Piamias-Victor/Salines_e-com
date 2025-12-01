import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cartService, CART_COOKIE_NAME } from '@/lib/services/cart';

export async function GET() {
    try {
        // TODO: Get real user ID from auth session
        const userId = undefined;
        const cart = await cartService.getCart(userId);
        return NextResponse.json(cart || { items: [] });
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
