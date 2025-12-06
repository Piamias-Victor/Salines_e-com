import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️ Clearing database...');

    try {
        // Delete in order to avoid foreign key constraints
        console.log('Deleting OrderItems...');
        await prisma.orderItem.deleteMany();

        console.log('Deleting CartItems...');
        await prisma.cartItem.deleteMany();

        console.log('Deleting WishlistItems...');
        await prisma.wishlistItem.deleteMany();

        console.log('Deleting Reviews...');
        await prisma.review.deleteMany();

        console.log('Deleting FeaturedProducts...');
        await prisma.featuredProduct.deleteMany();

        console.log('Deleting ProductCategories...');
        await prisma.productCategory.deleteMany();

        console.log('Deleting ProductBrands...');
        await prisma.productBrand.deleteMany();

        console.log('Deleting ProductPromotions...');
        await prisma.productPromotion.deleteMany();

        console.log('Deleting ProductImages...');
        await prisma.productImage.deleteMany();

        console.log('Deleting Products...');
        await prisma.product.deleteMany();

        console.log('✅ Database cleared of products and related data.');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
