import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const methods = await prisma.shippingMethod.findMany({
            include: {
                rates: {
                    orderBy: {
                        minWeight: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(methods);
    } catch (error) {
        console.error('Error fetching shipping methods:', error);
        return NextResponse.json(
            { error: 'Error fetching shipping methods' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, isActive, freeShippingThreshold } = body;

        const updatedMethod = await prisma.shippingMethod.update({
            where: { id },
            data: {
                isActive,
                freeShippingThreshold: freeShippingThreshold ? parseFloat(freeShippingThreshold) : null,
            },
        });

        return NextResponse.json(updatedMethod);
    } catch (error) {
        console.error('Error updating shipping method:', error);
        return NextResponse.json(
            { error: 'Error updating shipping method' },
            { status: 500 }
        );
    }
}
