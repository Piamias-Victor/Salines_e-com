import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                position: { gt: 0 },
            },
            orderBy: {
                position: 'asc',
            },
            take: 20,
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
