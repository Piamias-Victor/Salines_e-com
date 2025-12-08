import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visible = searchParams.get('visible') === 'true';

        // Fetch categories
        // If visible=true, filter by menuPosition > 0 (for Mega Menu)
        // Otherwise return all (for Dashboard)
        const where: any = { isActive: true };
        if (visible) {
            where.menuPosition = { gt: 0 };
        }

        const allCategories = await prisma.category.findMany({
            where,
            include: {
                parents: true,
            },
            orderBy: {
                menuPosition: 'asc',
            },
        });

        // Build hierarchical structure
        const categoryMap = new Map();
        const rootCategories: any[] = [];

        // First pass: create map of all categories
        allCategories.forEach((cat: any) => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        // Second pass: build hierarchy
        allCategories.forEach((cat: any) => {
            const category = categoryMap.get(cat.id);
            // If category has parents, add it as a child to each parent
            if (cat.parents && cat.parents.length > 0) {
                cat.parents.forEach((parent: any) => {
                    const parentCategory = categoryMap.get(parent.id);
                    if (parentCategory && !parentCategory.children.find((c: any) => c.id === category.id)) {
                        parentCategory.children.push(category);
                    }
                });
            } else {
                // No parents = root category
                rootCategories.push(category);
            }
        });

        return NextResponse.json(rootCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
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

        const category = await prisma.category.create({
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
                    connect: parentIds?.map((id: string) => ({ id })) || [],
                },
                products: {
                    create: productIds?.map((id: string) => ({
                        product: { connect: { id } }
                    })) || []
                }
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { updates } = body; // Array of { id, position?, menuPosition? }

        if (!Array.isArray(updates)) {
            return NextResponse.json(
                { error: 'Updates must be an array' },
                { status: 400 }
            );
        }

        // Update all positions in a transaction
        await prisma.$transaction(
            updates.map(({ id, position, menuPosition }) => {
                const data: any = {};
                if (position !== undefined) data.position = parseInt(position);
                if (menuPosition !== undefined) data.menuPosition = parseInt(menuPosition);

                return prisma.category.update({
                    where: { id },
                    data
                });
            })
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

