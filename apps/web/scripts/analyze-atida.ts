import puppeteer from 'puppeteer';
import fs from 'fs';

const TARGET_URL = 'https://www.newpharma.fr/marques';

async function main() {
    console.log('🚀 Starting Atida Analysis...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Basic stealth to be safe
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`Navigating to ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });

    // Dump HTML
    const html = await page.content();
    fs.writeFileSync('atida_brands.html', html);
    console.log('Dumped atida_brands.html');

    // Screenshot
    await page.screenshot({ path: 'atida_brands.png', fullPage: true });

    await browser.close();
}

main().catch(console.error);
