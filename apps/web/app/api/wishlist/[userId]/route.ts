import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: {
                userId,
            },
            include: {
                product: {
                    include: {
                        brands: {
                            include: {
                                brand: true,
                            },
                        },
                        promotions: {
                            include: {
                                promotion: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Also fetch user name for the title
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true },
        });

        return NextResponse.json({
            wishlistItems,
            ownerName: user?.firstName || 'Utilisateur'
        });
    } catch (error) {
        console.error('Get public wishlist error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
