import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCategoryPositions() {
    const categoryOrder = [
        { name: 'Beauté & Hygiène', position: 1 },
        { name: 'Santé', position: 2 },
        { name: 'Bébé & Maman', position: 3 },
        { name: 'Compléments alimentaires', position: 4 },
        { name: 'Black Friday', position: 5 },
        { name: 'Promotions & Nouveautés', position: 6 },
        { name: 'Bio & Naturel', position: 7 },
    ];

    console.log('Updating category positions...');

    for (const { name, position } of categoryOrder) {
        try {
            const result = await prisma.category.updateMany({
                where: { name },
                data: { position },
            });
            console.log(`✓ Updated "${name}" to position ${position} (${result.count} records)`);
        } catch (error) {
            console.error(`✗ Failed to update "${name}":`, error);
        }
    }

    console.log('Done!');
    await prisma.$disconnect();
}

updateCategoryPositions();
