import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearProductCategories() {
    try {
        // Supprimer les relations existantes pour permettre la migration
        await prisma.productCategory.deleteMany({});
        console.log('🗑️  Relations product_categories supprimées');
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearProductCategories();
