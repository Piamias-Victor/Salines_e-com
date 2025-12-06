const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Nettoyage de la base de données...');

    // Supprimer toutes les données
    await prisma.productBrand.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.category.deleteMany();

    console.log('✅ Base de données nettoyée');

    // Créer une catégorie
    const category = await prisma.category.create({
        data: {
            name: 'Soins du visage',
            slug: 'soins-visage',
            description: 'Produits pour le soin du visage',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
            isActive: true,
            position: 1,
        },
    });

    // Créer une marque
    const brand = await prisma.brand.create({
        data: {
            name: 'Vichy',
            slug: 'vichy',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
            isActive: true,
        },
    });

    // Créer un produit
    const product = await prisma.product.create({
        data: {
            name: 'Vichy Minéral 89',
            slug: 'vichy-mineral-89',
            ean: '3337875597388',
            sku: 'VICHY-M89',
            description: 'Concentré fortifiant et repulpant au quotidien',
            shortDescription: 'Soin hydratant fortifiant',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
            priceHT: 16.67,
            priceTTC: 20.00,
            tva: 20,
            stock: 100,
            maxOrderQuantity: 5,
            weight: 0.05,
            isActive: true,
            position: 1,
            categories: {
                create: {
                    categoryId: category.id,
                },
            },
            brands: {
                create: {
                    brandId: brand.id,
                },
            },
        },
    });

    console.log('✅ Produit créé:', product.name);
    console.log('📦 Stock:', product.stock);
    console.log('💰 Prix:', product.priceTTC, '€');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
