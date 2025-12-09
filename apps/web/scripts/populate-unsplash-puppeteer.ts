
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Unsplash image population (Puppeteer)...');

    // Get categories without images (or with loremflickr ones if we want to replace them? User said "met des vrai images")
    // Let's assume we want to replace ALL loremflickr images too since user hated them.
    const categories = await prisma.category.findMany({
        where: {
            OR: [
                { imageUrl: null },
                { imageUrl: '' },
                { imageUrl: { contains: 'loremflickr' } },
                { imageUrl: { contains: 'defaultImage' } }
            ]
        },
        orderBy: { name: 'asc' }
    });

    console.log(`Found ${categories.length} categories to update.`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Set viewport to desktop to get desktop layout
    await page.setViewport({ width: 1280, height: 800 });

    // Set generic User Agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36');

    for (const [index, cat] of categories.entries()) {
        const progress = `[${index + 1}/${categories.length}]`;

        let query = cat.name
            .toLowerCase()
            .replace(/produits?/g, '')
            .replace(/accessoires?/g, '')
            .replace(/soins?/g, '')
            .replace(/pour/g, '')
            .replace(/grande?/g, '')
            .replace(/taille/g, '')
            .replace(/kg/g, '')
            .trim();

        if (query.length < 2) query = cat.name;

        // Unsplash FR search URL
        const searchUrl = `https://unsplash.com/fr/s/photos/${encodeURIComponent(query)}`;

        try {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // 1. Try to get from <link rel="preload"> in head (Fastest/Safest)
            const headImage = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('link[rel="preload"][as="image"]'));
                for (const link of links) {
                    const srcSet = link.getAttribute('imagesrcset') || link.getAttribute('href');
                    // Look for standard unsplash URLs
                    if (srcSet && srcSet.includes('images.unsplash.com/photo-')) {
                        // Extract the first URL from srcset if needed
                        const firstUrl = srcSet.split(' ')[0];
                        return firstUrl;
                    }
                }
                return null;
            });

            if (headImage) {
                // Clean URL
                let cleanUrl = headImage;
                if (cleanUrl.includes('?')) {
                    cleanUrl = cleanUrl.split('?')[0];
                }
                const finalUrl = `${cleanUrl}?auto=format&fit=crop&w=800&q=80`;

                await prisma.category.update({
                    where: { id: cat.id },
                    data: { imageUrl: finalUrl }
                });
                console.log(`${progress} SUCCESS (Head): "${cat.name}" -> ${finalUrl}`);
                continue; // Move to next category
            }

            // 2. Fallback: Check body images
            // Try different selectors
            try {
                // Wait specifically for an image that is NOT an avatar or profile
                // Main photo grid images usually have a specific aspect ratio or class, but classes change.
                // We'll look for large images.
                await page.waitForSelector('img[src*="images.unsplash.com/photo-"]', { timeout: 5000 });

                const imgSrc = await page.evaluate(() => {
                    // Get all images
                    const imgs = Array.from(document.querySelectorAll('img'));
                    // Filter for unsplash photos
                    const photoImgs = imgs.filter(img =>
                        img.src.includes('images.unsplash.com/photo-') &&
                        !img.src.includes('profile') && // avoid profiles
                        img.naturalWidth > 200 // avoid tiny icons
                    );
                    return photoImgs.length > 0 ? photoImgs[0].src : null;
                });

                if (imgSrc) {
                    let cleanUrl = imgSrc;
                    if (cleanUrl.includes('?')) {
                        cleanUrl = cleanUrl.split('?')[0];
                    }
                    const finalUrl = `${cleanUrl}?auto=format&fit=crop&w=800&q=80`;

                    await prisma.category.update({
                        where: { id: cat.id },
                        data: { imageUrl: finalUrl }
                    });
                    console.log(`${progress} SUCCESS (Body): "${cat.name}" -> ${finalUrl}`);
                } else {
                    console.log(`${progress} NO IMAGE FOUND: "${cat.name}"`);
                }
            } catch (waitError) {
                console.log(`${progress} NO IMAGE (Timeout): "${cat.name}"`);
            }

        } catch (error) {
            console.error(`${progress} ERROR: "${cat.name}"`, error);
        }

        // Small delay to be nice
        await new Promise(r => setTimeout(r, 1000));
    }

    await browser.close();
    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
