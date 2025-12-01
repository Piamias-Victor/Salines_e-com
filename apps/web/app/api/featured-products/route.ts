import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all featured products
export async function GET() {
    try {
        const featuredProducts = await prisma.featuredProduct.findMany({
            where: {
                isActive: true,
            },
            include: {
                product: {
                    include: {
                        images: {
                            orderBy: { position: 'asc' },
                            take: 1,
                        },
                        brands: {
                            include: {
                                brand: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                position: 'asc',
            },
        });

        return NextResponse.json(featuredProducts);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured products' },
            { status: 500 }
        );
    }
}

// POST - Add a product to featured selection
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if already featured
        const existing = await prisma.featuredProduct.findUnique({
            where: { productId },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Product is already featured' },
                { status: 400 }
            );
        }

        // Get max position
        const maxPos = await prisma.featuredProduct.aggregate({
            _max: { position: true },
        });
        const position = (maxPos._max.position || 0) + 1;

        // Create featured product
        const featuredProduct = await prisma.featuredProduct.create({
            data: {
                productId,
                position,
            },
            include: {
                product: {
                    include: {
                        images: {
                            orderBy: { position: 'asc' },
                            take: 1,
                        },
                    },
                },
            },
        });

        return NextResponse.json(featuredProduct);
    } catch (error) {
        console.error('Error adding featured product:', error);
        return NextResponse.json(
            { error: 'Failed to add featured product' },
            { status: 500 }
        );
    }
}

// PATCH - Update positions
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { updates } = body; // Array of { id, position }

        if (!Array.isArray(updates)) {
            return NextResponse.json(
                { error: 'Updates must be an array' },
                { status: 400 }
            );
        }

        // Update all positions in a transaction
        await prisma.$transaction(
            updates.map(({ id, position }) =>
                prisma.featuredProduct.update({
                    where: { id },
                    data: { position: parseInt(position) },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating positions:', error);
        return NextResponse.json(
            { error: 'Failed to update positions' },
            { status: 500 }
        );
    }
}
