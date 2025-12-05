import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { verificationToken: token },
        });

        if (!user) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null, // Consume token
                isActive: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 });
    }
}
