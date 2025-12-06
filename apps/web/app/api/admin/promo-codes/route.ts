import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validation pour la création
const createPromoCodeSchema = z.object({
    code: z.string().min(3).regex(/^[A-Z0-9-_]+$/, "Le code doit contenir uniquement des majuscules, chiffres, tirets et underscores"),
    description: z.string().optional(),
    discountType: z.enum(['EURO', 'PERCENTAGE']),
    discountAmount: z.number().nonnegative(),
    minCartAmount: z.number().nonnegative().optional().nullable(),
    freeShipping: z.boolean().default(false),
    freeShippingMethodId: z.string().optional().nullable(),
    usageLimit: z.number().int().positive().optional().nullable(),
    perUserLimit: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().default(true),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
});

export async function GET() {
    try {
        const promoCodes = await prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                freeShippingMethod: true,
            },
        });
        return NextResponse.json(promoCodes);
    } catch (error) {
        console.error('[PROMO_CODES_GET]', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = createPromoCodeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const {
            code, description, discountType, discountAmount,
            minCartAmount, freeShipping, freeShippingMethodId, usageLimit, perUserLimit,
            isActive, startDate, endDate
        } = validation.data;

        // Vérifier si le code existe déjà
        const existingCode = await prisma.promoCode.findUnique({
            where: { code },
        });

        if (existingCode) {
            return NextResponse.json({ error: "Ce code existe déjà" }, { status: 409 });
        }

        const promoCode = await prisma.promoCode.create({
            data: {
                code,
                description,
                discountType,
                discountAmount,
                minCartAmount,
                freeShipping,
                freeShippingMethodId: freeShipping ? freeShippingMethodId : null,
                usageLimit,
                perUserLimit,
                isActive,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            },
        });

        return NextResponse.json(promoCode);
    } catch (error) {
        console.error('[PROMO_CODES_POST]', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
