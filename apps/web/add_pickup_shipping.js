const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('📦 Ajout du mode de livraison "Retrait en pharmacie"...\n');

    // Vérifier si le mode existe déjà
    const existing = await prisma.shippingMethod.findFirst({
        where: { name: 'Retrait en pharmacie' },
    });

    if (existing) {
        console.log('✅ Le mode "Retrait en pharmacie" existe déjà');
        console.log('ID:', existing.id);
        return;
    }

    // Créer le mode de livraison
    const shippingMethod = await prisma.shippingMethod.create({
        data: {
            name: 'Retrait en pharmacie',
            type: 'PICKUP',
            description: 'Retirez votre commande directement en pharmacie',
            isActive: true,
            freeShippingThreshold: 0, // Toujours gratuit
        },
    });

    console.log('✅ Mode de livraison créé avec succès !');
    console.log('ID:', shippingMethod.id);
    console.log('Nom:', shippingMethod.name);
    console.log('Type:', shippingMethod.type);
    console.log('Seuil livraison gratuite:', shippingMethod.freeShippingThreshold, '€');
    console.log('');
    console.log('💡 Ce mode est toujours gratuit (seuil = 0€)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
