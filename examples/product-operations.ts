import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Exemple 1: Créer un produit
    const product = await prisma.product.create({
        data: {
            name: 'Doliprane 1000mg',
            ean: '3400936404410',
            description: 'Médicament contre la douleur et la fièvre',
            slug: 'doliprane-1000mg',
            imageUrl: 'https://example.com/images/doliprane-1000.jpg',
            brand: 'Sanofi',
            priceHT: 3.50,
            priceTTC: 4.20,
            tva: 20.00,
            stock: 100,
            isActive: true,
        },
    });
    console.log('Produit créé:', product);

    // Exemple 2: Créer un produit avec des catégories
    const productWithCategories = await prisma.product.create({
        data: {
            name: 'Paracétamol 500mg',
            ean: '3400935752369',
            description: 'Antalgique et antipyrétique',
            slug: 'paracetamol-500mg',
            imageUrl: 'https://example.com/images/paracetamol-500.jpg',
            brand: 'Biogaran',
            priceHT: 2.10,
            priceTTC: 2.52,
            tva: 20.00,
            stock: 250,
            isActive: true,
            categories: {
                create: [
                    { categoryId: 'cat_medicaments' },
                    { categoryId: 'cat_antalgiques' },
                ],
            },
        },
    });
    console.log('Produit avec catégories créé:', productWithCategories);

    // Exemple 3: Récupérer tous les produits actifs
    const activeProducts = await prisma.product.findMany({
        where: {
            isActive: true,
        },
        include: {
            categories: true,
        },
    });
    console.log('Produits actifs:', activeProducts);

    // Exemple 4: Rechercher un produit par EAN
    const productByEan = await prisma.product.findUnique({
        where: {
            ean: '3400936404410',
        },
    });
    console.log('Produit trouvé par EAN:', productByEan);

    // Exemple 5: Mettre à jour le stock d'un produit
    const updatedProduct = await prisma.product.update({
        where: {
            ean: '3400936404410',
        },
        data: {
            stock: 95,
        },
    });
    console.log('Stock mis à jour:', updatedProduct);

    // Exemple 6: Rechercher des produits par marque
    const productsByBrand = await prisma.product.findMany({
        where: {
            brand: 'Sanofi',
        },
    });
    console.log('Produits Sanofi:', productsByBrand);

    // Exemple 7: Ajouter une catégorie à un produit existant
    await prisma.productCategory.create({
        data: {
            productId: product.id,
            categoryId: 'cat_medicaments',
        },
    });
    console.log('Catégorie ajoutée au produit');

    // Exemple 8: Désactiver un produit
    const deactivatedProduct = await prisma.product.update({
        where: {
            id: product.id,
        },
        data: {
            isActive: false,
        },
    });
    console.log('Produit désactivé:', deactivatedProduct);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
