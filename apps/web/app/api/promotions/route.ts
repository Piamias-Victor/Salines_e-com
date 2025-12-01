import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            orderBy: {
                position: 'asc',
            },
            include: {
                products: true,
            },
        });

        return NextResponse.json(promotions);
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch promotions' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            imageUrl,
            amount,
            type,
            redirectUrl,
            isActive,
            startDate,
            endDate,
            productIds,
            buttonText,
            buttonColor,
            buttonTextColor,
        } = body;

        // Get max position to append to end
        const maxPos = await prisma.promotion.aggregate({
            _max: { position: true }
        });
        const position = (maxPos._max.position || 0) + 1;

        const promotion = await prisma.promotion.create({
            data: {
                title,
                imageUrl,
                amount: amount.toString(), // Pass as string to preserve precision
                type,
                redirectUrl,
                position,
                isActive: isActive !== undefined ? isActive : true,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                buttonText,
                buttonColor,
                buttonTextColor,
                products: productIds?.length
                    ? {
                        create: productIds.map((id: string) => ({
                            product: { connect: { id } }
                        }))
                    }
                    : undefined,
            },
        });

        return NextResponse.json(promotion);
    } catch (error) {
        console.error('Error creating promotion:', error);
        return NextResponse.json(
            { error: 'Failed to create promotion' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { updates } = body; // Array of { id, position }

        if (!Array.isArray(updates)) {
            return NextResponse.json(
                { error: 'Updates must be an array' },
                { status: 400 }
            );
        }

        // Update all positions in a transaction
        await prisma.$transaction(
            updates.map(({ id, position }) =>
                prisma.promotion.update({
                    where: { id },
                    data: { position: parseInt(position) }
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating positions:', error);
        return NextResponse.json(
            { error: 'Failed to update positions' },
            { status: 500 }
        );
    }
}
