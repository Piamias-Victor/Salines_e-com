import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Listing categories...');
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true
        },
        orderBy: { name: 'asc' }
    });

    console.log(`Found ${categories.length} categories.`);
    console.table(categories.map(c => ({
        name: c.name,
        slug: c.slug,
        hasImage: !!c.imageUrl,
        imageUrl: c.imageUrl
    })));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
