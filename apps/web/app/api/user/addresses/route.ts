import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth/jwt';

// GET: Fetch all addresses for the authenticated user
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        const addresses = await prisma.address.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error('Get addresses error:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des adresses' }, { status: 500 });
    }
}

// POST: Create a new address
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        const body = await request.json();
        const {
            firstName,
            lastName,
            company,
            addressLine1,
            addressLine2,
            city,
            postalCode,
            country,
            phone,
            isDefault,
            isBilling,
            isShipping,
        } = body;

        // Validation simple
        if (!firstName || !lastName || !addressLine1 || !city || !postalCode || !phone) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: payload.userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: payload.userId,
                firstName,
                lastName,
                company,
                addressLine1,
                addressLine2,
                city,
                postalCode,
                country: country || 'France',
                phone,
                isDefault: isDefault || false,
                isBilling: isBilling || false,
                isShipping: isShipping !== undefined ? isShipping : true,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error('Create address error:', error);
        return NextResponse.json({ error: 'Erreur lors de la création de l\'adresse' }, { status: 500 });
    }
}
