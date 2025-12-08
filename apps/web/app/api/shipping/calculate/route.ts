import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { deliveryMode, weight } = body;

        // Validate input
        if (!deliveryMode || weight === undefined) {
            return NextResponse.json(
                { error: 'Missing deliveryMode or weight' },
                { status: 400 }
            );
        }

        // Get shipping method
        const method = await prisma.shippingMethod.findUnique({
            where: { type: deliveryMode },
            include: { rates: true },
        });

        if (!method || !method.isActive) {
            return NextResponse.json(
                { error: 'Shipping method not available' },
                { status: 404 }
            );
        }

        // For pharmacy pickup, it's always free
        if (deliveryMode === 'PHARMACY') {
            return NextResponse.json({
                cost: 0,
                isFree: true,
                method: method.name,
            });
        }

        // Find applicable rate based on weight
        const applicableRate = method.rates.find(
            (rate: any) => weight >= Number(rate.minWeight) && weight <= Number(rate.maxWeight)
        );

        if (!applicableRate) {
            return NextResponse.json(
                { error: 'No rate found for this weight' },
                { status: 404 }
            );
        }

        const cost = Number(applicableRate.price);
        const isFree = method.freeShippingThreshold
            ? false // Will be determined by cart total on checkout
            : false;

        return NextResponse.json({
            cost,
            isFree,
            method: method.name,
            freeThreshold: method.freeShippingThreshold ? Number(method.freeShippingThreshold) : null,
        });
    } catch (error) {
        console.error('Error calculating shipping cost:', error);
        return NextResponse.json(
            { error: 'Error calculating shipping cost' },
            { status: 500 }
        );
    }
}
