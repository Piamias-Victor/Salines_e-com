import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const methods = await prisma.shippingMethod.findMany({
            where: { isActive: true },
            include: {
                rates: {
                    orderBy: {
                        minWeight: 'asc',
                    },
                },
            },
        });

        // Fixed order: PHARMACY, HOME, RELAY
        const order = ['PHARMACY', 'HOME', 'RELAY'];
        const sorted = methods.sort((a: any, b: any) =>
            order.indexOf(a.type) - order.indexOf(b.type)
        );

        return NextResponse.json(sorted);
    } catch (error) {
        console.error('Error fetching shipping methods:', error);
        return NextResponse.json(
            { error: 'Error fetching shipping methods' },
            { status: 500 }
        );
    }
}
