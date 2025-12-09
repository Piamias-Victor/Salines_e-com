
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Brand Logo Population (Google Images)...');

    // 1. Fetch brands needing images
    const brands = await prisma.brand.findMany({
        where: {
            OR: [
                { imageUrl: null },
                { imageUrl: '' },
                // We re-process DDG and Bing links as user requested "vrai images" from Google
                { imageUrl: { contains: 'duckduckgo.com' } },
                { imageUrl: { contains: 'bing.net' } }
            ]
        },
        orderBy: { name: 'asc' }
    });

    console.log(`🎯 Found ${brands.length} brands to update.`);

    if (brands.length === 0) {
        console.log('✅ No brands to update. Exiting.');
        return;
    }

    // 2. Launch Browser
    const browser = await puppeteer.launch({
        headless: 'new', // Use new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    // User Agent essential for Google to serve standard HTML
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 3. Handle Cookie Consent (One-time)
    console.log('🍪 Handling Google Cookie Consent...');
    await page.goto('https://www.google.com/search?q=test&tbm=isch', { waitUntil: 'networkidle2' });

    try {
        // Try ID selectors first (common on Google)
        const acceptBtn = await page.$('#L2AGLb'); // Accept all
        const rejectBtn = await page.$('#W0wltc'); // Reject all

        let worked = false;
        if (acceptBtn) {
            console.log('✅ Found Accept button (#L2AGLb). Clicking...');
            await acceptBtn.click();
            worked = true;
        } else if (rejectBtn) {
            console.log('✅ Found Reject button (#W0wltc). Clicking...');
            await rejectBtn.click();
            worked = true;
        } else {
            // Fallback to role-based
            const consentButton = await page.$('button div[role="none"]');
            if (consentButton) {
                console.log('✅ Found consent button via generic selector. Clicking...');
                await consentButton.click();
                worked = true;
            }
        }

        if (worked) {
            // Navigation might not happen if it's a modal dismiss. use relaxed wait.
            try {
                await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
            } catch (navErr) {
                console.log('Context: Navigation timeout (normal if modal just closed).');
            }
        } else {
            // Fallback to text search
            const buttons = await page.$$('button');
            let found = false;
            for (const btn of buttons) {
                const text = await page.evaluate(el => el.textContent, btn);
                // console.log('Button found:', text); // verbose
                if (text && (
                    text.toLowerCase().includes('tout accepter') ||
                    text.toLowerCase().includes('accept all') ||
                    text.toLowerCase().includes('j\'accepte')
                )) {
                    await btn.click();
                    console.log('✅ Clicked cookie consent button (text match).');
                    try {
                        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
                    } catch (navErr) {/* ignore */ }
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log('⚠️ Could not find consent button by text.');
                await page.screenshot({ path: 'google_consent_fail.png' });
                fs.writeFileSync('google_consent_fail.html', await page.content());
                console.log('📸 Dumped google_consent_fail.png/html');
            }
        }
    } catch (e) {
        console.log('ℹ️ Error in consent handling:', e);
    }

    let successCount = 0;

    for (const [index, brand] of brands.entries()) {
        const progress = `[${index + 1}/${brands.length}]`;
        const brandName = brand.name.trim();

        if (brandName.length < 2) continue;

        const query = encodeURIComponent(`${brandName} logo`);
        const searchUrl = `https://www.google.com/search?q=${query}&tbm=isch`;

        try {
            console.log(`${progress} Searching for "${brandName}" on Google...`);
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Google Images grid selector is usually specific.
            // We want the first REAL image result.
            // .rg_i is a common class for result images in the grid
            try {
                await page.waitForSelector('.rg_i', { timeout: 5000 });

                const imageUrl = await page.evaluate(() => {
                    const images = Array.from(document.querySelectorAll('.rg_i'));
                    if (images.length > 0) {
                        const firstImg = images[0] as HTMLImageElement;
                        // Return src (base64 or http)
                        // Google often puts the real url in dataset, but scraping that is harder due to obfuscation.
                        // The src is usually a base64 thumbnail. 
                        // User said "prend la premiere image", so the thumbnail (even if base64) is arguably "the image".
                        // Use getAttribute('src') to avoid full url resolution if relative? No, full is fine.
                        return firstImg.src || firstImg.getAttribute('data-src');
                    }
                    return null;
                });

                if (imageUrl) {
                    await prisma.brand.update({
                        where: { id: brand.id },
                        data: { imageUrl: imageUrl }
                    });
                    // Log truncated
                    const logUrl = imageUrl.startsWith('data:') ? 'base64_data...' : imageUrl.substring(0, 50);
                    console.log(`${progress} ✅ SUCCESS: "${brandName}" -> ${logUrl}`);
                    successCount++;
                } else {
                    console.log(`${progress} ❌ NO IMAGE FOUND`);
                }

            } catch (waitError) {
                console.log(`${progress} ❌ TIMEOUT waiting for results.`);
                await page.screenshot({ path: 'google_timeout_debug.png' });
                const html = await page.content();
                fs.writeFileSync('google_timeout_debug.html', html);
                console.log(`📸 Dumped google_timeout_debug.html (${html.length} bytes)`);
                // Print page title
                const title = await page.title();
                console.log('Page Title:', title);
            }

        } catch (error) {
            console.error(`${progress} ❌ ERROR:`, error);
        }

        // Random delay to be human-like
        const delay = Math.floor(Math.random() * 1000) + 500;
        await new Promise(r => setTimeout(r, delay));
    }

    await browser.close();
    console.log(`\n🎉 Finished! Updated ${successCount}/${brands.length} brands from Google.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
