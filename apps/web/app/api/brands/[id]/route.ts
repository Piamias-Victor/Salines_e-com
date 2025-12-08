import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const brand = await prisma.brand.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            },
        });

        if (!brand) {
            return NextResponse.json(
                { error: 'Brand not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(brand);
    } catch (error) {
        console.error('Error fetching brand:', error);
        return NextResponse.json(
            { error: 'Failed to fetch brand' },
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
            name,
            slug,
            imageUrl,
            description,
            position,
            isActive,
            productIds,
        } = body;

        // Transaction to handle product updates cleanly
        const brand = await prisma.$transaction(async (tx: any) => {
            // 1. Update basic fields
            const updated = await tx.brand.update({
                where: { id },
                data: {
                    name,
                    slug,
                    imageUrl,
                    description,
                    position: parseInt(position) || 0,
                    isActive,
                },
            });

            // 2. Update products if provided
            if (productIds) {
                // Remove all existing links
                await tx.productBrand.deleteMany({
                    where: { brandId: id }
                });

                // Create new links
                if (productIds.length > 0) {
                    await tx.productBrand.createMany({
                        data: productIds.map((productId: string) => ({
                            brandId: id,
                            productId: productId
                        }))
                    });
                }
            }

            return updated;
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error('Error updating brand:', error);
        return NextResponse.json(
            { error: 'Failed to update brand' },
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
        await prisma.brand.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting brand:', error);
        return NextResponse.json(
            { error: 'Failed to delete brand' },
            { status: 500 }
        );
    }
}
