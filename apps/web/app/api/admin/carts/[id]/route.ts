import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // Await params in Next.js 15
        const { id } = await context.params;

        console.log('[ADMIN CART DETAILS] Session:', session?.user);
        console.log('[ADMIN CART DETAILS] Cart ID:', id);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized - Not logged in' }, { status: 401 });
        }

        // TODO: Re-enable admin check in production
        // if (session.user?.role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
        // }

        const cart = await prisma.cart.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        createdAt: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                priceTTC: true,
                                priceHT: true,
                                imageUrl: true,
                                stock: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                shippingMethod: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        // Calculate totals
        const itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        const subtotal = cart.items.reduce(
            (sum: number, item: any) => sum + Number(item.product.priceTTC) * item.quantity,
            0
        );

        return NextResponse.json({
            ...cart,
            stats: {
                itemCount,
                subtotal,
            },
        });
    } catch (error) {
        console.error('Error fetching cart details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart details' },
            { status: 500 }
        );
    }
}
