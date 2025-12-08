import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status'); // OrderStatus filter
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { guestEmail: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
            ];
        }

        // Get orders with all related data
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    shippingAddress: true,
                    billingAddress: true,
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    imageUrl: true,
                                    sku: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        // Calculate item counts for each order
        // Calculate item counts for each order
        const ordersWithStats = orders.map((order: any) => {
            const totalItems = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
            const pendingItems = order.items.filter((item: any) => item.status === 'PENDING').length;
            const preparedItems = order.items.filter((item: any) => item.status === 'PREPARED').length;

            return {
                ...order,
                stats: {
                    totalItems,
                    pendingItems,
                    preparedItems,
                },
            };
        });

        return NextResponse.json({
            orders: ordersWithStats,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
