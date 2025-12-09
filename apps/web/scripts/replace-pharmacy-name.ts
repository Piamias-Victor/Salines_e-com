import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting pharmacy name typo correction...');
    const searchString = 'Grand Pharmacie Des Salines';
    const replaceRegex = /Grand Pharmacie Des Salines/g;
    const replacement = 'Grande Pharmacie Des Salines';

    // 1. Categories
    console.log('\n--- Checking Categories ---');
    const categories = await prisma.category.findMany({
        where: {
            OR: [
                { description: { contains: searchString, mode: 'insensitive' } },
                { metaDescription: { contains: searchString, mode: 'insensitive' } },
            ]
        }
    });

    console.log(`Found ${categories.length} categories to update.`);

    for (const cat of categories) {
        let updated = false;
        const data: any = {};

        if (cat.description && replaceRegex.test(cat.description)) {
            data.description = cat.description.replace(replaceRegex, replacement);
            updated = true;
        }
        if (cat.metaDescription && replaceRegex.test(cat.metaDescription)) {
            data.metaDescription = cat.metaDescription.replace(replaceRegex, replacement);
            updated = true;
        }

        if (updated) {
            await prisma.category.update({
                where: { id: cat.id },
                data
            });
            console.log(`Updated Category: ${cat.name} (${cat.slug})`);
        }
    }

    // 2. Products
    console.log('\n--- Checking Products ---');
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { description: { contains: searchString, mode: 'insensitive' } },
                { shortDescription: { contains: searchString, mode: 'insensitive' } },
                { usageTips: { contains: searchString, mode: 'insensitive' } },
            ]
        }
    });

    console.log(`Found ${products.length} products to update.`);

    for (const prod of products) {
        let updated = false;
        const data: any = {};

        if (prod.description && replaceRegex.test(prod.description)) {
            data.description = prod.description.replace(replaceRegex, replacement);
            updated = true;
        }
        if (prod.shortDescription && replaceRegex.test(prod.shortDescription)) {
            data.shortDescription = prod.shortDescription.replace(replaceRegex, replacement);
            updated = true;
        }
        if (prod.usageTips && replaceRegex.test(prod.usageTips)) {
            data.usageTips = prod.usageTips.replace(replaceRegex, replacement);
            updated = true;
        }

        if (updated) {
            await prisma.product.update({
                where: { id: prod.id },
                data
            });
            console.log(`Updated Product: ${prod.name} (${prod.slug})`);
        }
    }

    // 3. Brands
    console.log('\n--- Checking Brands ---');
    const brands = await prisma.brand.findMany({
        where: {
            description: { contains: searchString, mode: 'insensitive' }
        }
    });

    console.log(`Found ${brands.length} brands to update.`);

    for (const brand of brands) {
        if (brand.description && replaceRegex.test(brand.description)) {
            await prisma.brand.update({
                where: { id: brand.id },
                data: {
                    description: brand.description.replace(replaceRegex, replacement)
                }
            });
            console.log(`Updated Brand: ${brand.name}`);
        }
    }

    // 4. Also check for just "Agnès Praden" without "Pharmacie" just in case, but be careful
    // The user asked to replace "pharmacie Agnès Praden", so the regex /pharmacie\s+agnès\s+praden/gi covers it.
    // If we simply replace "Agnès Praden" we might end up with "Pharmacie Grand Pharmacie Des Salines" if we are not careful,
    // but the regex above handles the whole phrase.
    // Let's add a secondary check for "Agnès Praden" NOT preceded by "pharmacie " just to be thorough?
    // User request: "remplace toutes les notion a pharmacie Agnès Praden par Grand Pharmacie Des Salines"
    // I will stick to the safer full phrase replacement first.

    console.log('\nDone.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
