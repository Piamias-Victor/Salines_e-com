
import fs from 'fs';
import https from 'https';

// Helper to fetch URL content
function fetchUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (err) => reject(err));
    });
}

async function main() {
    const url = 'https://unsplash.com/s/photos/shampoo';
    console.log(`Fetching ${url}...`);
    try {
        const html = await fetchUrl(url);
        fs.writeFileSync('unsplash_debug.html', html);
        console.log('Saved HTML to unsplash_debug.html');

        // Log the first 1000 chars to see if we got content or a block/redirect
        console.log('Preview:', html.slice(0, 1000));

        // Check if we can find any image URL in the dump
        const match = html.match(/https:\/\/images\.unsplash\.com\/photo-[^"'\s\\]+/);
        console.log('Match found in dump?', !!match);
    } catch (e) {
        console.error(e);
    }
}

main();
