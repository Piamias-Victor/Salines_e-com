
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Starting database cleanup...');

    try {
        // Use TRUNCATE with CASCADE to clear all content tables efficiently
        // We exclude 'users' table
        const tables = [
            'product_promotions',
            'product_brands',
            'product_categories',
            'product_images',
            'products',
            'promotions',
            'brands',
            'banners',
            'categories',
            // '_CategoryHierarchy' is implicit, usually handled by truncating categories if cascade works, 
            // or we might need to truncate it explicitly if we knew the name. 
            // Prisma implicit tables are usually `_ModelToModel`.
            // Let's try to truncate the known tables first.
        ];

        console.log(`Truncating tables: ${tables.join(', ')}...`);

        // Construct the query. We can truncate multiple tables at once.
        // "TRUNCATE TABLE table1, table2, ... RESTART IDENTITY CASCADE;"
        const query = `TRUNCATE TABLE "${tables.join('", "')}" RESTART IDENTITY CASCADE;`;

        await prisma.$executeRawUnsafe(query);

        console.log('✅ Database cleanup completed! (Users preserved)');
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
