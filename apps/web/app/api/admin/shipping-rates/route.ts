import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { shippingMethodId, minWeight, maxWeight, price } = body;

        const rate = await prisma.shippingRate.create({
            data: {
                shippingMethodId,
                minWeight: parseFloat(minWeight),
                maxWeight: parseFloat(maxWeight),
                price: parseFloat(price),
            },
        });

        return NextResponse.json(rate);
    } catch (error) {
        console.error('Error creating shipping rate:', error);
        return NextResponse.json(
            { error: 'Error creating shipping rate' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, minWeight, maxWeight, price } = body;

        const updateData: any = {};
        if (minWeight !== undefined) updateData.minWeight = parseFloat(minWeight);
        if (maxWeight !== undefined) updateData.maxWeight = parseFloat(maxWeight);
        if (price !== undefined) updateData.price = parseFloat(price);

        const rate = await prisma.shippingRate.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(rate);
    } catch (error) {
        console.error('Error updating shipping rate:', error);
        return NextResponse.json(
            { error: 'Error updating shipping rate' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing rate ID' },
                { status: 400 }
            );
        }

        await prisma.shippingRate.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting shipping rate:', error);
        return NextResponse.json(
            { error: 'Error deleting shipping rate' },
            { status: 500 }
        );
    }
}
