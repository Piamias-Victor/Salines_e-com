import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const promotion = await prisma.promotion.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });

        if (!promotion) {
            return NextResponse.json(
                { error: 'Promotion not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(promotion);
    } catch (error) {
        console.error('Error fetching promotion:', error);
        return NextResponse.json(
            { error: 'Failed to fetch promotion' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
            position,
            productIds,
            buttonText,
            buttonColor,
            buttonTextColor,
        } = body;


        // Transaction to handle product updates cleanly
        const promotion = await prisma.$transaction(async (tx: any) => {
            // 1. Update basic fields
            const updated = await tx.promotion.update({
                where: { id },
                data: {
                    title,
                    imageUrl,
                    amount: amount.toString(),
                    type,
                    redirectUrl,
                    position: position !== undefined ? parseInt(position) : undefined,
                    isActive,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                    buttonText,
                    buttonColor,
                    buttonTextColor,
                },
            });

            // 2. Update products if provided
            if (productIds !== undefined) {
                // Delete existing relations
                await tx.productPromotion.deleteMany({
                    where: { promotionId: id },
                });

                // Create new relations
                if (productIds.length > 0) {
                    await tx.productPromotion.createMany({
                        data: productIds.map((productId: string) => ({
                            promotionId: id,
                            productId,
                        })),
                    });
                }
            }

            return updated;
        }, {
            timeout: 10000, // 10 seconds timeout
        });

        return NextResponse.json(promotion);
    } catch (error) {
        console.error('Error updating promotion:', error);
        return NextResponse.json(
            { error: 'Failed to update promotion' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.promotion.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting promotion:', error);
        return NextResponse.json(
            { error: 'Failed to delete promotion' },
            { status: 500 }
        );
    }
}
