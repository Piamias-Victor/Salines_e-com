
import puppeteer from 'puppeteer';
import fs from 'fs';

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36');

    try {
        await page.goto('https://unsplash.com/fr/s/photos/shampoo', { waitUntil: 'domcontentloaded' });
        // Wait a bit
        await new Promise(r => setTimeout(r, 5000));

        const html = await page.content();
        fs.writeFileSync('puppeteer_debug.html', html);

        // Also take a screenshot?
        // await page.screenshot({ path: 'puppeteer_debug.png' });

        console.log('Dumped HTML to puppeteer_debug.html');
    } catch (e) {
        console.error(e);
    }

    await browser.close();
}

main();
