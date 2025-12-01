import { PrismaClient } from '../apps/web/node_modules/.prisma/client';

const prisma = new PrismaClient();

async function createTestPromotions() {
    try {
        await prisma.promotion.deleteMany({});
        console.log('🗑️  Anciennes promotions supprimées');

        const promotions = await prisma.promotion.createMany({
            data: [
                {
                    title: 'Black Friday -30%',
                    imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800&auto=format&fit=crop',
                    amount: 30.00,
                    type: 'PERCENT',
                    redirectUrl: '/promotions/black-friday',
                    position: 1,
                    isActive: true,
                },
                {
                    title: 'Soins Visage -15€',
                    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
                    amount: 15.00,
                    type: 'EURO',
                    redirectUrl: '/category/soins-visage',
                    position: 2,
                    isActive: true,
                },
                {
                    title: 'Complément Alimentaire -20%',
                    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
                    amount: 20.00,
                    type: 'PERCENT',
                    redirectUrl: '/category/complements-alimentaires',
                    position: 3,
                    isActive: true,
                },
                {
                    title: 'Bébé & Maman -10€',
                    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop',
                    amount: 10.00,
                    type: 'EURO',
                    redirectUrl: '/category/bebe-maman',
                    position: 4,
                    isActive: true,
                },
            ],
        });

        console.log('✅ 4 promotions de test créées avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de la création des promotions:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestPromotions();
