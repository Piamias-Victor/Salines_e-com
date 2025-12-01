import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Rate limiting store (in-memory, simple implementation)
// For production, use Redis or a proper rate limiting service
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = 100; // 100 requests
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_LIMIT = 100; // Maximum products per request

function getRateLimitKey(request: NextRequest): string {
    // Get IP from various headers (Vercel, Cloudflare, etc.)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    return `ratelimit:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    // Clean up expired entries periodically
    if (rateLimitStore.size > 10000) {
        for (const [k, v] of rateLimitStore.entries()) {
            if (v.resetTime < now) {
                rateLimitStore.delete(k);
            }
        }
    }

    if (!record || record.resetTime < now) {
        // Create new record
        const resetTime = now + RATE_LIMIT_WINDOW;
        rateLimitStore.set(key, { count: 1, resetTime });
        return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime };
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetTime: record.resetTime };
}

export async function GET(request: NextRequest) {
    try {
        // Rate limiting check
        const rateLimitKey = getRateLimitKey(request);
        const rateLimit = checkRateLimit(rateLimitKey);

        // Add rate limit headers
        const headers = {
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        };

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests',
                    message: 'Rate limit exceeded. Please try again later.',
                    resetAt: new Date(rateLimit.resetTime).toISOString(),
                },
                { status: 429, headers }
            );
        }

        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const limitParam = searchParams.get('limit');
        const pageParam = searchParams.get('page');

        const search = searchParams.get('search');

        const isAdmin = searchParams.get('admin') === 'true';

        // Validate and sanitize parameters
        let limit = limitParam ? parseInt(limitParam, 10) : 20;
        let page = pageParam ? parseInt(pageParam, 10) : 1;

        // Apply constraints
        if (isNaN(limit) || limit < 1) limit = 20;
        if (limit > MAX_LIMIT) limit = MAX_LIMIT; // Security: max 100 products per request
        if (isNaN(page) || page < 1) page = 1;

        const skip = (page - 1) * limit;

        const where: any = isAdmin ? {} : { isActive: true };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { ean: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Query database
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    ean: true,
                    imageUrl: true,
                    priceTTC: true,
                    promotionId: true,
                    stock: true,
                    isActive: true,
                    brands: {
                        select: {
                            brandId: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc', // Most recent first
                },
            }),
            prisma.product.count({
                where,
            }),
        ]);

        // Format response
        const formattedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            ean: product.ean,
            imageUrl: product.imageUrl,
            priceTTC: Number(product.priceTTC), // Convert Decimal to number
            brands: product.brands.map((b) => b.brandId), // Array of brand IDs (will be names when Brand model exists)
            promotionId: product.promotionId,
            stock: product.stock,
            isActive: product.isActive,
        }));

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json(
            {
                data: formattedProducts,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                },
            },
            { headers }
        );
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: 'Failed to fetch products',
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            ean,
            sku,
            description,
            shortDescription,
            slug,
            imageUrl,
            images,
            priceHT,
            priceTTC,
            tva,
            stock,
            maxOrderQuantity,
            weight,
            isMedicament,
            notice,
            composition,
            usageTips,
            precautions,
            metaTitle,
            metaDescription,
            isActive,
            position,
            categoryIds,
            brandIds,
        } = body;

        // Validate required fields
        if (!name || !ean || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields: name, ean, slug' },
                { status: 400 }
            );
        }

        // Validate medicament-specific rules
        if (isMedicament && !notice) {
            return NextResponse.json(
                { error: 'Notice is required for medicaments' },
                { status: 400 }
            );
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                name,
                ean,
                sku,
                description,
                shortDescription,
                slug,
                imageUrl,
                priceHT: parseFloat(priceHT),
                priceTTC: parseFloat(priceTTC),
                tva: parseFloat(tva),
                stock: parseInt(stock) || 0,
                maxOrderQuantity: maxOrderQuantity ? parseInt(maxOrderQuantity) : null,
                weight: weight ? parseFloat(weight) : null,
                isMedicament: isMedicament || false,
                notice,
                composition,
                usageTips,
                precautions,
                metaTitle,
                metaDescription,
                isActive: isActive !== undefined ? isActive : true,
                position: position ? parseInt(position) : 0,
                // Create category associations
                categories: categoryIds?.length
                    ? {
                        create: categoryIds.map((categoryId: string) => ({
                            categoryId,
                        })),
                    }
                    : undefined,
                // Create brand associations
                brands: brandIds?.length
                    ? {
                        create: brandIds.map((brandId: string) => ({
                            brandId,
                        })),
                    }
                    : undefined,
                // Create additional images
                images: images?.length
                    ? {
                        create: images.map((img: any, index: number) => ({
                            url: img.url,
                            alt: img.alt || name,
                            position: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                brands: {
                    include: {
                        brand: true,
                    },
                },
                images: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);

        // Handle unique constraint violations
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: `A product with this ${error.meta?.target?.[0]} already exists` },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

