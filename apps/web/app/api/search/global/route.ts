import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({
                brands: [],
                categories: [],
                products: []
            });
        }

        const normalizedQuery = query.trim();
        const searchPattern = `%${normalizedQuery}%`;

        try {
            // Try using unaccent for accent-insensitive search
            const [brands, categories, products] = await Promise.all([
                prisma.$queryRaw<any[]>`
                    SELECT DISTINCT b.*
                    FROM brands b
                    LEFT JOIN product_brands pb ON b.id = pb."brandId"
                    LEFT JOIN products p ON pb."productId" = p.id
                    WHERE b."isActive" = true
                    AND (
                        unaccent(b.name) ILIKE unaccent(${searchPattern})
                        OR (
                            p."isActive" = true
                            AND (
                                unaccent(p.name) ILIKE unaccent(${searchPattern})
                                OR unaccent(p.description) ILIKE unaccent(${searchPattern})
                            )
                        )
                    )
                    ORDER BY b.position ASC
                    LIMIT 5
                `,
                prisma.$queryRaw<any[]>`
                    SELECT DISTINCT c.*
                    FROM categories c
                    LEFT JOIN product_categories pc ON c.id = pc."categoryId"
                    LEFT JOIN products p ON pc."productId" = p.id
                    LEFT JOIN product_brands pb ON p.id = pb."productId"
                    LEFT JOIN brands b ON pb."brandId" = b.id
                    WHERE c."isActive" = true
                    AND (
                        unaccent(c.name) ILIKE unaccent(${searchPattern})
                        OR (
                            p."isActive" = true
                            AND (
                                unaccent(p.name) ILIKE unaccent(${searchPattern})
                                OR unaccent(p.description) ILIKE unaccent(${searchPattern})
                                OR unaccent(b.name) ILIKE unaccent(${searchPattern})
                            )
                        )
                    )
                    ORDER BY c.position ASC
                    LIMIT 5
                `,
                prisma.$queryRaw<any[]>`
                    SELECT p.id, p.name, p.ean, p.sku, p.description, p."shortDescription", p.slug, 
                           p."imageUrl", p."priceHT", p."priceTTC", p.tva, p.stock, p."maxOrderQuantity",
                           p.weight, p."isMedicament", p.notice, p.composition, p."usageTips", 
                           p.precautions, p."metaTitle", p."metaDescription", p."isActive", 
                           p.position, p."promotionId", p."createdAt", p."updatedAt",
                           json_agg(DISTINCT jsonb_build_object('url', pi.url)) FILTER (WHERE pi.id IS NOT NULL) as images,
                           json_agg(DISTINCT jsonb_build_object('brand', jsonb_build_object('id', b.id, 'name', b.name, 'slug', b.slug, 'imageUrl', b."imageUrl"))) FILTER (WHERE b.id IS NOT NULL) as brands
                    FROM products p
                    LEFT JOIN product_images pi ON p.id = pi."productId" AND pi.position = 0
                    LEFT JOIN product_brands pb ON p.id = pb."productId"
                    LEFT JOIN brands b ON pb."brandId" = b.id
                    WHERE p."isActive" = true
                    AND (
                        unaccent(p.name) ILIKE unaccent(${searchPattern})
                        OR unaccent(p.description) ILIKE unaccent(${searchPattern})
                        OR unaccent(b.name) ILIKE unaccent(${searchPattern})
                    )
                    GROUP BY p.id
                    LIMIT 10
                `,
            ]);

            return NextResponse.json({ brands, categories, products });
        } catch (error: any) {
            // Fallback to regular case-insensitive search if unaccent is not available
            // Fallback to regular case-insensitive search if unaccent is not available
            // P2010 is raw query failed, 42883 is undefined function
            if (error.code === '42883' || (error.code === 'P2010' && error.message?.includes('42883'))) {
                console.warn('unaccent extension not available, falling back to regular ILIKE');

                const [brands, categories, products] = await Promise.all([
                    prisma.$queryRaw<any[]>`
                        SELECT DISTINCT b.*
                        FROM brands b
                        LEFT JOIN product_brands pb ON b.id = pb."brandId"
                        LEFT JOIN products p ON pb."productId" = p.id
                        WHERE b."isActive" = true
                        AND (
                            b.name ILIKE ${searchPattern}
                            OR (
                                p."isActive" = true
                                AND (
                                    p.name ILIKE ${searchPattern}
                                    OR p.description ILIKE ${searchPattern}
                                )
                            )
                        )
                        ORDER BY b.position ASC
                        LIMIT 5
                    `,
                    prisma.$queryRaw<any[]>`
                        SELECT DISTINCT c.*
                        FROM categories c
                        LEFT JOIN product_categories pc ON c.id = pc."categoryId"
                        LEFT JOIN products p ON pc."productId" = p.id
                        LEFT JOIN product_brands pb ON p.id = pb."productId"
                        LEFT JOIN brands b ON pb."brandId" = b.id
                        WHERE c."isActive" = true
                        AND (
                            c.name ILIKE ${searchPattern}
                            OR (
                                p."isActive" = true
                                AND (
                                    p.name ILIKE ${searchPattern}
                                    OR p.description ILIKE ${searchPattern}
                                    OR b.name ILIKE ${searchPattern}
                                )
                            )
                        )
                        ORDER BY c.position ASC
                        LIMIT 5
                    `,
                    prisma.$queryRaw<any[]>`
                        SELECT p.id, p.name, p.ean, p.sku, p.description, p."shortDescription", p.slug, 
                               p."imageUrl", p."priceHT", p."priceTTC", p.tva, p.stock, p."maxOrderQuantity",
                               p.weight, p."isMedicament", p.notice, p.composition, p."usageTips", 
                               p.precautions, p."metaTitle", p."metaDescription", p."isActive", 
                               p.position, p."promotionId", p."createdAt", p."updatedAt",
                               json_agg(DISTINCT jsonb_build_object('url', pi.url)) FILTER (WHERE pi.id IS NOT NULL) as images,
                               json_agg(DISTINCT jsonb_build_object('brand', jsonb_build_object('id', b.id, 'name', b.name, 'slug', b.slug, 'imageUrl', b."imageUrl"))) FILTER (WHERE b.id IS NOT NULL) as brands
                        FROM products p
                        LEFT JOIN product_images pi ON p.id = pi."productId" AND pi.position = 0
                        LEFT JOIN product_brands pb ON p.id = pb."productId"
                        LEFT JOIN brands b ON pb."brandId" = b.id
                        WHERE p."isActive" = true
                        AND (
                            p.name ILIKE ${searchPattern}
                            OR p.description ILIKE ${searchPattern}
                            OR b.name ILIKE ${searchPattern}
                        )
                        GROUP BY p.id
                        LIMIT 10
                    `,
                ]);

                return NextResponse.json({ brands, categories, products });
            }
            throw error;
        }

    } catch (error) {
        console.error('Global search error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
