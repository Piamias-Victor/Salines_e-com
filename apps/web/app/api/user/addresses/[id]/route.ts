import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth/jwt';

// PUT: Update an existing address
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        const { id } = await params;

        // Verify ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id },
        });

        if (!existingAddress || existingAddress.userId !== payload.userId) {
            return NextResponse.json({ error: 'Adresse non trouvée' }, { status: 404 });
        }

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

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: payload.userId,
                    isDefault: true,
                    id: { not: id },
                },
                data: { isDefault: false },
            });
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
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
            },
        });

        return NextResponse.json(updatedAddress);
    } catch (error) {
        console.error('Update address error:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'adresse' }, { status: 500 });
    }
}

// DELETE: Delete an address
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        const { id } = await params;

        // Verify ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id },
        });

        if (!existingAddress || existingAddress.userId !== payload.userId) {
            return NextResponse.json({ error: 'Adresse non trouvée' }, { status: 404 });
        }

        await prisma.address.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete address error:', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression de l\'adresse' }, { status: 500 });
    }
}
