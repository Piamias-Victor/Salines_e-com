const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🎉 Création d\'une promotion test...');

    // Récupérer le produit existant
    const product = await prisma.product.findFirst();

    if (!product) {
        console.error('❌ Aucun produit trouvé');
        return;
    }

    console.log('📦 Produit trouvé:', product.name);
    console.log('💰 Prix original:', product.priceTTC, '€');

    // Créer une promotion -5€
    const promotion = await prisma.promotion.create({
        data: {
            title: 'Promo -5€',
            amount: 5,
            type: 'EURO',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
            redirectUrl: '/product/' + product.slug,
            position: 1,
            isActive: true,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
            buttonText: 'JE FONCE',
        },
    });

    console.log('✅ Promotion créée:', promotion.title);

    // Lier la promotion au produit
    await prisma.productPromotion.create({
        data: {
            productId: product.id,
            promotionId: promotion.id,
        },
    });

    console.log('🔗 Promotion liée au produit');
    console.log('💸 Nouveau prix:', Number(product.priceTTC) - 5, '€');
    console.log('');
    console.log('✅ Promotion test créée avec succès !');
    console.log('📅 Valide jusqu\'au:', promotion.endDate.toLocaleDateString('fr-FR'));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
