
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        const brands = await prisma.brand.findMany({
            where: {
                isActive: true,
                position: { gt: 0 },
            },
            orderBy: {
                position: 'asc',
            },
            take: limit,
            skip: offset,
        });

        return NextResponse.json(brands);
    } catch (error) {
        console.error('Error fetching featured brands:', error);
        return NextResponse.json(
            { error: 'Failed to fetch brands' },
            { status: 500 }
        );
    }
}
