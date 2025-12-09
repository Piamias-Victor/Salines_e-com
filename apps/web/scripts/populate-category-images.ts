
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Helper to fetch URL content
// Helper to delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('Starting LoremFlickr image population...');

    // Get categories without images
    const categories = await prisma.category.findMany({
        where: {
            OR: [
                { imageUrl: null },
                { imageUrl: '' }
            ],
            isActive: true
        },
        orderBy: { name: 'asc' }
    });

    console.log(`Found ${categories.length} categories needing images.`);

    let successCount = 0;
    let failCount = 0;

    for (const [index, cat] of categories.entries()) {
        const progress = `[${index + 1}/${categories.length}]`;

        // Clean name for query
        // Remove common words that might pollute search
        let query = cat.name
            .toLowerCase()
            .replace(/produits?/g, '')
            .replace(/accessoires?/g, '')
            .replace(/soins?/g, '')
            .replace(/pour/g, '')
            .replace(/grand/g, '') // remove grand from pharmacy names if present, or generic sizes
            .replace(/taille/g, '')
            .replace(/kg/g, '')
            .trim();

        if (query.length < 2) query = cat.name; // Fallback if we cleaned too much

        // Format for LoremFlickr (comma separated tags)
        const tags = query.split(/\s+/).join(',');
        const searchUrl = `https://loremflickr.com/800/600/${encodeURIComponent(tags)},pharmacy`;

        try {
            // Random delay to be polite
            await delay(500 + Math.random() * 1000);

            // Fetch HEAD or GET to follow redirect
            const response = await fetch(searchUrl, {
                redirect: 'follow',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
                }
            });

            if (response.ok && response.url && !response.url.includes('loremflickr.com/800/600')) {
                // If we got a redirected URL (the actual image)
                const finalUrl = response.url;

                // Update DB
                await prisma.category.update({
                    where: { id: cat.id },
                    data: { imageUrl: finalUrl }
                });

                console.log(`${progress} SUCCESS: "${cat.name}" -> ${finalUrl}`);
                successCount++;
            } else {
                console.log(`${progress} NO IMAGE (Redirect failed): "${cat.name}"`);
                failCount++;
            }

        } catch (error) {
            console.error(`${progress} ERROR: "${cat.name}"`, error);
            failCount++;
        }
    }

    console.log('\n--- Finished ---');
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
