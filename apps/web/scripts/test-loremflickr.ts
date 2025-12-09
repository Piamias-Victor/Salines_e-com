
async function main() {
    const keyword = 'shampoo,bottle';
    const url = `https://loremflickr.com/800/600/${keyword}`;
    console.log(`Fetching ${url}...`);

    try {
        const response = await fetch(url, { redirect: 'follow' });
        console.log('Final URL:', response.url);
        console.log('Status:', response.status);
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
