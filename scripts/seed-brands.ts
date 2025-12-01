
import { PrismaClient } from '../apps/web/node_modules/.prisma/client';

const prisma = new PrismaClient();

const brands = [
    {
        name: 'La Roche-Posay',
        slug: 'la-roche-posay',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/La_Roche-Posay_logo.svg/2560px-La_Roche-Posay_logo.svg.png',
        position: 1,
    },
    {
        name: 'Avène',
        slug: 'avene',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Av%C3%A8ne_logo.svg/2560px-Av%C3%A8ne_logo.svg.png',
        position: 2,
    },
    {
        name: 'Bioderma',
        slug: 'bioderma',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Bioderma_logo.svg/2560px-Bioderma_logo.svg.png',
        position: 3,
    },
    {
        name: 'Nuxe',
        slug: 'nuxe',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d3/Logo_Nuxe.png/800px-Logo_Nuxe.png',
        position: 4,
    },
    {
        name: 'Vichy',
        slug: 'vichy',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Vichy_Laboratoires_logo.svg/2560px-Vichy_Laboratoires_logo.svg.png',
        position: 5,
    },
    {
        name: 'Caudalie',
        slug: 'caudalie',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/60/Caudalie_logo.svg/1200px-Caudalie_logo.svg.png',
        position: 6,
    },
    {
        name: 'Uriage',
        slug: 'uriage',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Uriage_logo.svg/2560px-Uriage_logo.svg.png',
        position: 7,
    },
    {
        name: 'Klorane',
        slug: 'klorane',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/30/Klorane_logo.svg/1200px-Klorane_logo.svg.png',
        position: 8,
    },
    {
        name: 'Biotherm',
        slug: 'biotherm',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Biotherm_logo.svg/2560px-Biotherm_logo.svg.png',
        position: 9,
    },
    {
        name: 'Filorga',
        slug: 'filorga',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Filorga_logo.svg/2560px-Filorga_logo.svg.png',
        position: 10,
    },
];

async function main() {
    console.log('Start seeding brands...');

    for (const brand of brands) {
        await prisma.brand.upsert({
            where: { slug: brand.slug },
            update: {
                name: brand.name,
                imageUrl: brand.imageUrl,
                position: brand.position,
                isActive: true,
            },
            create: {
                name: brand.name,
                slug: brand.slug,
                imageUrl: brand.imageUrl,
                position: brand.position,
                isActive: true,
            },
        });
        console.log(`Upserted brand: ${brand.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
