import { NextResponse } from 'next/server';
import { cartService } from '@/lib/services/cart';

interface RouteParams {
    params: Promise<{ itemId: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const { itemId } = await params;
        const body = await req.json();
        const { quantity } = body;

        if (quantity === undefined) {
            return NextResponse.json({ error: 'Missing quantity' }, { status: 400 });
        }

        const updatedItem = await cartService.updateItemQuantity(itemId, quantity);
        return NextResponse.json(updatedItem);
    } catch (error: any) {
        console.error('[CART_ITEM_PATCH]', error);

        // Handle item not found as 404 instead of 500
        if (error.message === 'Item not found') {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { itemId } = await params;
        await cartService.removeItem(itemId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[CART_ITEM_DELETE]', error);
        return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
    }
}
