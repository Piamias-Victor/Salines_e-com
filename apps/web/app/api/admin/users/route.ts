import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        // Auth check
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Search params
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Query
        const where = search ? {
            OR: [
                { firstName: { contains: search, mode: 'insensitive' as const } },
                { lastName: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
            ],
        } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: { orders: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
