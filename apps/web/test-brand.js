const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testBrand() {
    try {
        console.log('Testing brand.create...');
        const brand = await prisma.brand.create({
            data: {
                name: 'Test Brand',
                slug: 'test-brand',
                position: 1,
                isActive: true,
            },
        });
        console.log('✅ Brand created:', brand);

        // Clean up
        await prisma.brand.delete({ where: { id: brand.id } });
        console.log('✅ Brand deleted');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testBrand();
