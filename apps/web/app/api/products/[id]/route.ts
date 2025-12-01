import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const product = await prisma.product.findUnique({
            where: { id },
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

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

        // Validate medicament-specific rules
        if (isMedicament && !notice) {
            return NextResponse.json(
                { error: 'Notice is required for medicaments' },
                { status: 400 }
            );
        }

        // Delete existing category and brand associations
        await prisma.productCategory.deleteMany({
            where: { productId: id },
        });
        await prisma.productBrand.deleteMany({
            where: { productId: id },
        });

        // Update product
        const product = await prisma.product.update({
            where: { id },
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
                // Create new category associations
                categories: categoryIds?.length
                    ? {
                        create: categoryIds.map((categoryId: string) => ({
                            categoryId,
                        })),
                    }
                    : undefined,
                // Create new brand associations
                brands: brandIds?.length
                    ? {
                        create: brandIds.map((brandId: string) => ({
                            brandId,
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

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Error updating product:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: `A product with this ${error.meta?.target?.[0]} already exists` },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
