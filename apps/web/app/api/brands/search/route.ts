import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visible = searchParams.get('visible') === 'true';

        const where: any = { isActive: true };
        if (visible) {
            where.searchPosition = { gt: 0 };
        }

        const brands = await prisma.brand.findMany({
            where,
            orderBy: {
                searchPosition: 'asc',
            },
        });

        return NextResponse.json(brands);
    } catch (error) {
        console.error('Error fetching search brands:', error);
        return NextResponse.json(
            { error: 'Failed to fetch brands' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { updates } = body; // Array of { id, searchPosition }

        if (!Array.isArray(updates)) {
            return NextResponse.json(
                { error: 'Updates must be an array' },
                { status: 400 }
            );
        }

        // Update all positions in a transaction
        await prisma.$transaction(
            updates.map(({ id, searchPosition }) =>
                prisma.brand.update({
                    where: { id },
                    data: { searchPosition: parseInt(searchPosition) }
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating search positions:', error);
        return NextResponse.json(
            { error: 'Failed to update positions' },
            { status: 500 }
        );
    }
}
