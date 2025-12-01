import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCategories() {
    try {
        await prisma.category.deleteMany({});
        console.log('🗑️  Anciennes catégories supprimées');

        // 1. Création des catégories parentes (Niveau 1)
        const visage = await prisma.category.create({
            data: {
                name: 'Visage',
                slug: 'visage',
                description: 'Soins pour le visage',
                imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2000&auto=format&fit=crop',
                featuredLinks: [
                    {
                        title: 'Top Labos : La Roche-Posay',
                        url: '/brand/la-roche-posay',
                        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop'
                    },
                    {
                        title: 'Routine Anti-Âge',
                        url: '/category/anti-age',
                        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop'
                    }
                ]
            }
        });

        const corps = await prisma.category.create({
            data: {
                name: 'Corps',
                slug: 'corps',
                description: 'Soins pour le corps',
                imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2000&auto=format&fit=crop',
            }
        });

        const sante = await prisma.category.create({
            data: {
                name: 'Santé',
                slug: 'sante',
                description: 'Produits de santé et premiers soins',
                imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2000&auto=format&fit=crop',
            }
        });

        const bebe = await prisma.category.create({
            data: {
                name: 'Bébé & Maman',
                slug: 'bebe-maman',
                description: 'Tout pour bébé et maman',
                imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df4?q=80&w=2000&auto=format&fit=crop',
            }
        });

        // 2. Création des sous-catégories (Niveau 2)

        // Sous-catégories Visage
        const cremesVisage = await prisma.category.create({
            data: {
                name: 'Crèmes de jour',
                slug: 'cremes-jour',
                parents: { connect: { id: visage.id } }
            }
        });

        const nettoyants = await prisma.category.create({
            data: {
                name: 'Nettoyants & Démaquillants',
                slug: 'nettoyants',
                parents: { connect: { id: visage.id } }
            }
        });

        const serums = await prisma.category.create({
            data: {
                name: 'Sérums',
                slug: 'serums',
                parents: { connect: { id: visage.id } }
            }
        });

        // Sous-catégories Corps
        const hydratantsCorps = await prisma.category.create({
            data: {
                name: 'Hydratants Corps',
                slug: 'hydratants-corps',
                parents: { connect: { id: corps.id } }
            }
        });

        const solaires = await prisma.category.create({
            data: {
                name: 'Solaires',
                slug: 'solaires',
                parents: { connect: { id: corps.id } }
            }
        });

        // Sous-catégories Santé
        const premiersSecours = await prisma.category.create({
            data: {
                name: 'Premiers Secours',
                slug: 'premiers-secours',
                parents: { connect: { id: sante.id } }
            }
        });

        const complements = await prisma.category.create({
            data: {
                name: 'Compléments Alimentaires',
                slug: 'complements-alimentaires',
                parents: { connect: { id: sante.id } }
            }
        });

        console.log('✅ Catégories créées avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors de la création des catégories:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createCategories();
