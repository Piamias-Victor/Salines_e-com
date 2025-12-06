import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Auth check
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                        total: true,
                        createdAt: true,
                        paymentStatus: true,
                    }
                },
                _count: {
                    select: { orders: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
