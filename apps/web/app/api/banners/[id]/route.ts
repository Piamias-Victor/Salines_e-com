import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const banner = await prisma.banner.findUnique({
            where: { id },
        });

        if (!banner) {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(banner);
    } catch (error) {
        console.error('Error fetching banner:', error);
        return NextResponse.json(
            { error: 'Failed to fetch banner' },
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
            alt,
            imageUrl,
            redirectUrl,
            isActive,
            startDate,
            endDate,
            position,
            text,
            textColor,
            showButton,
            buttonColor,
        } = body;

        const banner = await prisma.banner.update({
            where: { id },
            data: {
                title,
                alt,
                imageUrl,
                redirectUrl,
                position: position !== undefined ? parseInt(position) : undefined,
                isActive,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                text,
                textColor,
                showButton,
                buttonColor,
            },
        });

        return NextResponse.json(banner);
    } catch (error) {
        console.error('Error updating banner:', error);
        return NextResponse.json(
            { error: 'Failed to update banner' },
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
        await prisma.banner.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting banner:', error);
        return NextResponse.json(
            { error: 'Failed to delete banner' },
            { status: 500 }
        );
    }
}
