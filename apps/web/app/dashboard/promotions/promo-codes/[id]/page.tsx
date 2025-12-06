import { PromoCodeForm } from '@/components/dashboard/promotions/PromoCodeForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditPromoCodePage({ params }: { params: { id: string } }) {
    const promoCode = await prisma.promoCode.findUnique({
        where: { id: params.id },
    });

    if (!promoCode) {
        notFound();
    }

    // Convert Decimal to number for the form
    const formattedPromoCode = {
        ...promoCode,
        discountAmount: Number(promoCode.discountAmount),
        minCartAmount: promoCode.minCartAmount ? Number(promoCode.minCartAmount) : undefined,
        startDate: promoCode.startDate ? promoCode.startDate.toISOString() : undefined,
        endDate: promoCode.endDate ? promoCode.endDate.toISOString() : undefined,
        createdAt: promoCode.createdAt.toISOString(),
        updatedAt: promoCode.updatedAt.toISOString(),
    };

    return <PromoCodeForm initialData={formattedPromoCode as any} />;
}
