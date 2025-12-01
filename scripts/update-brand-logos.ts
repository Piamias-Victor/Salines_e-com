import { PrismaClient } from '../apps/web/node_modules/.prisma/client';

const prisma = new PrismaClient();

const brands = [
    {
        slug: 'la-roche-posay',
        imageUrl: 'https://logo.clearbit.com/laroche-posay.fr',
    },
    {
        slug: 'avene',
        imageUrl: 'https://logo.clearbit.com/eau-thermale-avene.fr',
    },
    {
        slug: 'bioderma',
        imageUrl: 'https://logo.clearbit.com/bioderma.fr',
    },
    {
        slug: 'nuxe',
        imageUrl: 'https://logo.clearbit.com/nuxe.com',
    },
    {
        slug: 'vichy',
        imageUrl: 'https://logo.clearbit.com/vichy.fr',
    },
    {
        slug: 'caudalie',
        imageUrl: 'https://logo.clearbit.com/caudalie.com',
    },
    {
        slug: 'uriage',
        imageUrl: 'https://logo.clearbit.com/uriage.com',
    },
    {
        slug: 'klorane',
        imageUrl: 'https://logo.clearbit.com/klorane.com',
    },
    {
        slug: 'biotherm',
        imageUrl: 'https://logo.clearbit.com/biotherm.fr',
    },
    {
        slug: 'filorga',
        imageUrl: 'https://logo.clearbit.com/filorga.com',
    },
];

async function main() {
    console.log('Updating brand logos...');

    for (const brand of brands) {
        await prisma.brand.update({
            where: { slug: brand.slug },
            data: {
                imageUrl: brand.imageUrl,
            },
        });
        console.log(`Updated logo for: ${brand.slug}`);
    }

    console.log('✅ All brand logos updated!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
