import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestBanners() {
    try {
        // Supprimer les bannières existantes pour éviter les doublons lors des tests
        await prisma.banner.deleteMany({});
        console.log('🗑️  Anciennes bannières supprimées');

        const banners = [
            {
                title: 'Promotions d\'Hiver',
                alt: 'Soldes sur les produits d\'hiver',
                imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2000&auto=format&fit=crop', // Image générique pharmacie/santé
                redirectUrl: '/promotions',
                position: 1,
                isActive: true,
            },
            {
                title: 'Nouveaux Compléments Alimentaires',
                alt: 'Gamme bio de compléments',
                imageUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2000&auto=format&fit=crop', // Image compléments
                redirectUrl: '/category/complements',
                position: 2,
                isActive: true,
            },
            {
                title: 'Soins Bébé',
                alt: 'Tout pour votre bébé',
                imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df4?q=80&w=2000&auto=format&fit=crop', // Image bébé
                redirectUrl: '/category/bebe',
                position: 3,
                isActive: true,
            },
        ];

        for (const banner of banners) {
            await prisma.banner.create({
                data: banner,
            });
        }

        console.log(`✅ ${banners.length} bannières de test créées avec succès !`);

    } catch (error) {
        console.error('❌ Erreur lors de la création des bannières:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestBanners();
