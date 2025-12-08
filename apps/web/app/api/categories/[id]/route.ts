import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                parents: true,
                products: {
                    include: {
                        product: true
                    }
                }
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const {
            name,
            slug,
            description,
            imageUrl,
            highlightColor,
            highlightTextColor,
            position,
            menuPosition,
            isActive,
            startDate,
            endDate,
            parentIds,
            featuredLinks,
            productIds,
            metaTitle,
            metaDescription,
        } = body;

        // Transaction to handle product updates cleanly
        const category = await prisma.$transaction(async (tx: any) => {
            // 1. Update basic fields
            const updated = await tx.category.update({
                where: { id },
                data: {
                    name,
                    slug,
                    description,
                    imageUrl,
                    highlightColor,
                    highlightTextColor,
                    position: parseInt(position) || 0,
                    menuPosition: parseInt(menuPosition) || 0,
                    isActive,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                    featuredLinks: featuredLinks || [],
                    metaTitle,
                    metaDescription,
                    parents: {
                        set: parentIds?.map((id: string) => ({ id })) || [],
                    },
                },
            });

            // 2. Update products if provided
            if (productIds) {
                // Remove all existing links
                await tx.productCategory.deleteMany({
                    where: { categoryId: id }
                });

                // Create new links
                if (productIds.length > 0) {
                    await tx.productCategory.createMany({
                        data: productIds.map((productId: string) => ({
                            categoryId: id,
                            productId: productId
                        }))
                    });
                }
            }

            return updated;
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
