import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getProductBySlug = cache(async (slug: string) => {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: {
                orderBy: { position: 'asc' },
            },
            brands: {
                include: {
                    brand: true,
                },
            },
            categories: {
                include: {
                    category: {
                        include: {
                            parents: {
                                include: {
                                    parents: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return product;
});
