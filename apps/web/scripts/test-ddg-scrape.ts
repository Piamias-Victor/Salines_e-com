
import puppeteer from 'puppeteer';
import fs from 'fs';
import { PrismaClient } from '@prisma/client'; // Assuming Prisma client availability, adjust import if needed
// Mocking Prisma for POC if actual import fails, but assuming user has it setup based on previous context.
// Actually, I should check where PrismaClient is. Usually `libs/db` or generated client.
// Let's assume standard import for now or use the one from `apps/web/scripts/populate-brand-images.ts`

// using direct html url in main
// const DDG_URL = ...

async function main() {
    console.log('🚀 Starting Logo Scraper (DuckDuckGo)...');

    // 1. Launch Browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 2. Define test brand
    const brandName = "Arkopharma";
    const query = encodeURIComponent(`${brandName} logo`);
    // Revert to JS version for Image Search
    const targetUrl = `https://duckduckgo.com/?iax=images&ia=images&q=${query}`;

    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });

    // 3. Extract Image
    // DuckDuckGo image results usually have class 'tile--img__img' or similar.
    // We need to wait for selector.
    try {
        // Wait for at least one image loaded via their proxy
        await page.waitForSelector('img[src*="external-content.duckduckgo.com/iu/"]', { timeout: 15000 });

        const images = await page.evaluate(() => {
            // Find all images being proxied by DDG (these are the results)
            // Filter out small icons if needed, but usually the tiles are main images.
            const imgs = Array.from(document.querySelectorAll('img[src*="external-content.duckduckgo.com/iu/"]'));

            return imgs
                .map(img => (img as HTMLImageElement).src)
                .filter(src => src.includes('external-content.duckduckgo.com/iu/'));
        });

        if (images.length > 0) {
            console.log(`✅ Found ${images.length} logo candidates.`);
            console.log(`First Match: ${images[0]}`);
        } else {
            console.log(`❌ No proxy images found.`);
            await page.screenshot({ path: 'ddg_js_debug.png' });
        }

    } catch (e) {
        console.error('Error finding image selectors:', e);
        await page.screenshot({ path: 'ddg_error.png' });
    }

    await browser.close();
}

main().catch(console.error);
