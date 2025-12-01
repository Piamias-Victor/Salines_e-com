import { PrismaClient } from '../apps/web/node_modules/.prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
    try {
        // Catégories pour "Nos Univers" (homepage) - 10 catégories
        const featuredCategories = [
            { name: 'Soins', slug: 'soins', imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800', position: 1, menuPosition: 2, highlightColor: null },
            { name: 'Santé', slug: 'sante', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800', position: 2, menuPosition: 3, highlightColor: null },
            { name: 'Compléments Alimentaires', slug: 'complements-alimentaires', imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800', position: 3, menuPosition: 4, highlightColor: null },
            { name: 'Bébé & Maman', slug: 'bebe-et-maman', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800', position: 4, menuPosition: 5, highlightColor: null },
            { name: 'Cheveux', slug: 'cheveux', imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800', position: 5, menuPosition: 6, highlightColor: null },
            { name: 'Bio & Naturel', slug: 'bio-et-naturel', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b73?q=80&w=800', position: 6, menuPosition: 7, highlightColor: null },
            { name: 'Minceur', slug: 'minceur', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800', position: 7, menuPosition: 0, highlightColor: null },
            { name: 'Solaire', slug: 'solaire', imageUrl: 'https://images.unsplash.com/photo-1556228578-dd6c8b0e9a8c?q=80&w=800', position: 8, menuPosition: 0, highlightColor: null },
            { name: 'Bucco-Dentaire', slug: 'bucco-dentaire', imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800', position: 9, menuPosition: 0, highlightColor: null },
            { name: 'Vétérinaire', slug: 'veterinaire', imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=800', position: 10, menuPosition: 0, highlightColor: null },
        ];

        // Catégories supplémentaires pour le menu uniquement
        const menuOnlyCategories = [
            { name: 'Beauté & Hygiène', slug: 'beaute-et-hygiene', imageUrl: null, position: 0, menuPosition: 1, highlightColor: null },
            { name: 'Black Friday', slug: 'black-friday', imageUrl: null, position: 0, menuPosition: 8, highlightColor: '#000000' },
            { name: 'Promotions & Nouveautés', slug: 'promotions-et-nouveautes', imageUrl: null, position: 0, menuPosition: 9, highlightColor: '#fef000' },
        ];

        const allCategories = [...featuredCategories, ...menuOnlyCategories];

        for (const cat of allCategories) {
            await prisma.category.upsert({
                where: { slug: cat.slug },
                update: {
                    name: cat.name,
                    imageUrl: cat.imageUrl,
                    position: cat.position,
                    menuPosition: cat.menuPosition,
                    highlightColor: cat.highlightColor,
                    isActive: true,
                },
                create: {
                    name: cat.name,
                    slug: cat.slug,
                    imageUrl: cat.imageUrl,
                    position: cat.position,
                    menuPosition: cat.menuPosition,
                    highlightColor: cat.highlightColor,
                    isActive: true,
                },
            });
        }

        // Désactiver les anciennes catégories qui ne sont plus utilisées
        await prisma.category.updateMany({
            where: {
                slug: {
                    in: ['hygiene'], // Hygiène en doublon avec Beauté & Hygiène
                },
            },
            data: {
                isActive: false,
            },
        });

        console.log('✅ Catégories mises à jour avec succès !');
        console.log(`   - ${featuredCategories.length} catégories pour "Nos Univers"`);
        console.log(`   - ${menuOnlyCategories.length} catégories supplémentaires pour le menu`);
        console.log(`   - Catégories dupliquées désactivées`);
    } catch (error) {
        console.error('❌ Erreur lors du seed des catégories:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedCategories();
