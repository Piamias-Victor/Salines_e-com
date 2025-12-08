import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderIds } = body;

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json({ error: 'Order IDs are required' }, { status: 400 });
        }

        // Fetch all selected orders with their items
        const orders = await prisma.order.findMany({
            where: {
                id: { in: orderIds },
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                shippingAddress: true,
                items: {
                    where: {
                        status: {
                            in: ['PENDING', 'PREPARING'], // Only include items that need preparation
                        },
                    },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });

        // Group products across all orders
        const productMap = new Map<string, {
            productId: string;
            productName: string;
            sku: string;
            imageUrl: string | null;
            totalQuantity: number;
            orders: string[]; // Order numbers where this product appears
        }>();

        orders.forEach((order: any) => {
            order.items.forEach((item: any) => {
                const existing = productMap.get(item.productId);
                if (existing) {
                    existing.totalQuantity += item.quantity;
                    if (!existing.orders.includes(order.orderNumber)) {
                        existing.orders.push(order.orderNumber);
                    }
                } else {
                    productMap.set(item.productId, {
                        productId: item.productId,
                        productName: item.product.name,
                        sku: item.product.sku || '',
                        imageUrl: item.product.imageUrl,
                        totalQuantity: item.quantity,
                        orders: [order.orderNumber],
                    });
                }
            });
        });

        const groupedProducts = Array.from(productMap.values()).sort((a, b) =>
            a.productName.localeCompare(b.productName)
        );

        const totalItems = groupedProducts.reduce((sum: number, p: any) => sum + p.totalQuantity, 0);

        return NextResponse.json({
            orders: orders.map((o: any) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : o.guestEmail,
            })),
            groupedProducts,
            totalItems,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error generating preparation sheet:', error);
        return NextResponse.json(
            { error: 'Failed to generate preparation sheet' },
            { status: 500 }
        );
    }
}
