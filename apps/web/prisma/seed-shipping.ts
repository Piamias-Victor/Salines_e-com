import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding shipping methods...');

    // 1. Pharmacy Pickup (Click & Collect)
    await prisma.shippingMethod.upsert({
        where: { type: 'PHARMACY' },
        update: {},
        create: {
            name: 'Retrait en Pharmacie',
            type: 'PHARMACY',
            description: 'Retrait gratuit en 2h',
            isActive: true,
            freeShippingThreshold: 0, // Always free
        },
    });

    // 2. Home Delivery
    const homeMethod = await prisma.shippingMethod.upsert({
        where: { type: 'HOME' },
        update: {},
        create: {
            name: 'Livraison à Domicile',
            type: 'HOME',
            description: 'Livraison Colissimo sous 48h',
            isActive: true,
            freeShippingThreshold: 50, // Free above 50€
        },
    });

    // Default rates for Home
    const homeRatesCount = await prisma.shippingRate.count({
        where: { shippingMethodId: homeMethod.id },
    });

    if (homeRatesCount === 0) {
        await prisma.shippingRate.create({
            data: {
                shippingMethodId: homeMethod.id,
                minWeight: 0,
                maxWeight: 100, // Up to 100kg
                price: 4.90,
            },
        });
    }

    // 3. Relay Point
    const relayMethod = await prisma.shippingMethod.upsert({
        where: { type: 'RELAY' },
        update: {},
        create: {
            name: 'Point Relais',
            type: 'RELAY',
            description: 'Livraison en point relais sous 3-4j',
            isActive: true,
            freeShippingThreshold: 40, // Free above 40€
        },
    });

    // Default rates for Relay
    const relayRatesCount = await prisma.shippingRate.count({
        where: { shippingMethodId: relayMethod.id },
    });

    if (relayRatesCount === 0) {
        await prisma.shippingRate.create({
            data: {
                shippingMethodId: relayMethod.id,
                minWeight: 0,
                maxWeight: 100, // Up to 100kg
                price: 3.90,
            },
        });
    }

    console.log('Shipping methods seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
