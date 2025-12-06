import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updatePromoCodeSchema = z.object({
    code: z.string().min(3).regex(/^[A-Z0-9-_]+$/, "Le code doit contenir uniquement des majuscules, chiffres, tirets et underscores").optional(),
    description: z.string().optional(),
    discountType: z.enum(['EURO', 'PERCENTAGE']).optional(),
    discountAmount: z.number().nonnegative().optional(),
    minCartAmount: z.number().nonnegative().optional().nullable(),
    freeShipping: z.boolean().optional(),
    freeShippingMethodId: z.string().optional().nullable(),
    usageLimit: z.number().int().positive().optional().nullable(),
    perUserLimit: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validation = updatePromoCodeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const {
            code, description, discountType, discountAmount,
            minCartAmount, freeShipping, freeShippingMethodId, usageLimit, perUserLimit,
            isActive, startDate, endDate
        } = validation.data;

        // Si on change le code, vérifier l'unicité
        if (code) {
            const existingCode = await prisma.promoCode.findFirst({
                where: {
                    code,
                    NOT: { id }
                },
            });

            if (existingCode) {
                return NextResponse.json({ error: "Ce code existe déjà" }, { status: 409 });
            }
        }

        const promoCode = await prisma.promoCode.update({
            where: { id },
            data: {
                code,
                description,
                discountType,
                discountAmount,
                minCartAmount,
                freeShipping,
                freeShippingMethodId: freeShipping ? freeShippingMethodId : (freeShipping === false ? null : undefined), // If disabling free shipping, clear method. If enabling, set method. If undefined, leave as is.
                usageLimit,
                perUserLimit,
                isActive,
                startDate: startDate ? new Date(startDate) : undefined, // undefined to ignore if not provided, null to clear
                endDate: endDate ? new Date(endDate) : undefined,
            },
        });

        return NextResponse.json(promoCode);
    } catch (error) {
        console.error('[PROMO_CODE_PATCH]', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.promoCode.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Promo code deleted' });
    } catch (error) {
        console.error('[PROMO_CODE_DELETE]', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
