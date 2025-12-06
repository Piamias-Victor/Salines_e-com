const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Vérification du panier...\n');

    // Récupérer le panier avec les items
    const cart = await prisma.cart.findFirst({
        include: {
            items: {
                include: {
                    product: true,
                    appliedPromotion: true,
                },
            },
        },
    });

    if (!cart) {
        console.log('❌ Aucun panier trouvé');
        return;
    }

    console.log('📦 Panier trouvé:', cart.id);
    console.log('🛒 Nombre d\'items:', cart.items.length);
    console.log('');

    cart.items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log('  Produit:', item.product.name);
        console.log('  Prix produit:', item.product.priceTTC, '€');
        console.log('  Quantité:', item.quantity);
        console.log('  appliedPromotionId:', item.appliedPromotionId || 'null');
        console.log('  appliedPromotionPrice:', item.appliedPromotionPrice || 'null');
        if (item.appliedPromotion) {
            console.log('  Promotion:', item.appliedPromotion.title);
            console.log('  Montant:', item.appliedPromotion.amount, item.appliedPromotion.type);
        }
        console.log('');
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
