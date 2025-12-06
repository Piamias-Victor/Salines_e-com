import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch user's wishlist
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: {
                userId: payload.userId,
            },
            include: {
                product: {
                    include: {
                        brands: {
                            include: {
                                brand: true,
                            },
                        },
                        promotions: {
                            include: {
                                promotion: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ wishlistItems });
    } catch (error) {
        console.error('Get wishlist error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Add product to wishlist
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId: payload.userId,
                productId,
            },
        });

        return NextResponse.json({ wishlistItem });
    } catch (error) {
        // Handle unique constraint violation (already in wishlist)
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ message: 'Already in wishlist' }, { status: 200 });
        }
        console.error('Add to wishlist error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Remove product from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await prisma.wishlistItem.deleteMany({
            where: {
                userId: payload.userId,
                productId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
