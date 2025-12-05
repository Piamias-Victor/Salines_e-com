import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();

        console.log('[ADMIN CARTS] Session:', session?.user);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized - Not logged in' }, { status: 401 });
        }

        // TODO: Re-enable admin check in production
        // if (session.user?.role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
        // }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const type = searchParams.get('type'); // 'user' | 'guest' | null

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (type === 'user') {
            where.userId = { not: null };
        } else if (type === 'guest') {
            where.userId = null;
        }

        if (search) {
            where.OR = [
                { sessionToken: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
            ];
        }

        // Get carts with items and user info
        const [carts, total] = await Promise.all([
            prisma.cart.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    priceTTC: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                    shippingMethod: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.cart.count({ where }),
        ]);

        // Calculate totals and item counts
        const cartsWithStats = carts.map((cart) => {
            const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            const total = cart.items.reduce(
                (sum, item) => sum + Number(item.product.priceTTC) * item.quantity,
                0
            );

            return {
                id: cart.id,
                userId: cart.userId,
                sessionToken: cart.sessionToken,
                user: cart.user,
                itemCount,
                total,
                shippingMethod: cart.shippingMethod,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
            };
        });

        return NextResponse.json({
            carts: cartsWithStats,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching carts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch carts' },
            { status: 500 }
        );
    }
}
