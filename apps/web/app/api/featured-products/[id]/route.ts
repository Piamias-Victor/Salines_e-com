import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - Remove a product from featured selection
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.featuredProduct.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting featured product:', error);
        return NextResponse.json(
            { error: 'Failed to delete featured product' },
            { status: 500 }
        );
    }
}
