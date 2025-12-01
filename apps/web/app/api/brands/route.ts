import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visible = searchParams.get('visible') === 'true';

        const where: any = { isActive: true };
        if (visible) {
            where.position = { gt: 0 };
        }

        const brands = await prisma.brand.findMany({
            where,
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json(
            { error: 'Failed to fetch brands' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            slug,
            imageUrl,
            position,
            isActive,
            productIds,
        } = body;

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                imageUrl,
                position: parseInt(position) || 0,
                isActive: isActive !== undefined ? isActive : true,
                products: productIds?.length
                    ? {
                        create: productIds.map((id: string) => ({
                            product: { connect: { id } }
                        }))
                    }
                    : undefined,
            },
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error('Error creating brand:', error);
        return NextResponse.json(
            { error: 'Failed to create brand' },
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
                prisma.brand.update({
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
