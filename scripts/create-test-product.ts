import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestProduct() {
    try {
        // Récupérer les catégories existantes
        const sante = await prisma.category.findFirst({ where: { slug: 'sante' } });
        const premiersSecours = await prisma.category.findFirst({ where: { slug: 'premiers-secours' } });

        if (!sante || !premiersSecours) {
            throw new Error('Catégories requises non trouvées. Veuillez lancer create-test-categories.ts d\'abord.');
        }

        // Créer un produit de test avec catégories et marques
        const product = await prisma.product.create({
            data: {
                name: 'Doliprane 1000mg - Boîte de 8 comprimés',
                ean: '3400936404410',
                description: 'Médicament à base de paracétamol indiqué en cas de douleur et/ou fièvre telles que maux de tête, états grippaux, douleurs dentaires, courbatures.',
                slug: 'doliprane-1000mg-8-comprimes',
                imageUrl: 'https://www.pharmacie-en-ligne.com/images/doliprane-1000.jpg',
                priceHT: 2.50,
                priceTTC: 3.00,
                tva: 20.00,
                stock: 150,
                isActive: true,
                // Ajouter des catégories
                categories: {
                    create: [
                        { categoryId: sante.id },
                        { categoryId: premiersSecours.id },
                    ],
                },
                // Ajouter une marque
                brands: {
                    create: [
                        { brandId: 'brand_sanofi' },
                    ],
                },
            },
            include: {
                categories: true,
                brands: true,
            },
        });

        console.log('✅ Produit de test créé avec succès !');
        console.log('');
        console.log('📦 Détails du produit:');
        console.log('─────────────────────────────────────────');
        console.log(`ID: ${product.id}`);
        console.log(`Nom: ${product.name}`);
        console.log(`EAN: ${product.ean}`);
        console.log(`Slug: ${product.slug}`);
        console.log(`Prix HT: ${product.priceHT}€`);
        console.log(`Prix TTC: ${product.priceTTC}€`);
        console.log(`TVA: ${product.tva}%`);
        console.log(`Stock: ${product.stock} unités`);
        console.log(`Actif: ${product.isActive ? 'Oui' : 'Non'}`);
        console.log('');
        console.log(`📁 Catégories (${product.categories.length}):`);
        product.categories.forEach(cat => {
            console.log(`  - ${cat.categoryId}`);
        });
        console.log('');
        console.log(`🏷️  Marques (${product.brands.length}):`);
        product.brands.forEach(brand => {
            console.log(`  - ${brand.brandId}`);
        });
        console.log('─────────────────────────────────────────');
        console.log('');
        console.log('🎨 Vous pouvez voir ce produit dans Prisma Studio:');
        console.log('   http://localhost:5555');

    } catch (error) {
        console.error('❌ Erreur lors de la création du produit:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createTestProduct();
