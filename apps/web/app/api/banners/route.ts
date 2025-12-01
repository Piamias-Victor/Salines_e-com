import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: {
                position: 'asc',
            },
        });

        return NextResponse.json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        return NextResponse.json(
            { error: 'Failed to fetch banners' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            alt,
            imageUrl,
            redirectUrl,
            isActive,
            startDate,
            endDate,
            text,
            textColor,
            showButton,
            buttonColor,
        } = body;

        // Get max position to append to end
        const maxPos = await prisma.banner.aggregate({
            _max: { position: true }
        });
        const position = (maxPos._max.position || 0) + 1;

        const banner = await prisma.banner.create({
            data: {
                title,
                alt,
                imageUrl,
                redirectUrl,
                position,
                isActive: isActive !== undefined ? isActive : true,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                text,
                textColor,
                showButton: showButton || false,
                buttonColor,
            },
        });

        return NextResponse.json(banner);
    } catch (error) {
        console.error('Error creating banner:', error);
        return NextResponse.json(
            { error: 'Failed to create banner' },
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
                prisma.banner.update({
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
