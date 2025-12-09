
async function main() {
    const query = 'shampoo';
    const url = `https://unsplash.com/s/photos/${query}`;
    console.log(`Fetching ${url}...`);

    try {
        const response = await fetch(url);
        const html = await response.text();

        // Unsplash uses srcset or regular img src. 
        // We look for the first image that looks like a photo (images.unsplash.com/photo-...)
        // Regex to find: https://images.unsplash.com/photo-[a-zA-Z0-9-]+?ixlib=...

        const match = html.match(/https:\/\/images\.unsplash\.com\/photo-[^"'\s\\]+/);

        if (match) {
            // Usually these URLs have extra params, we want to clean them or keep them small
            // We'll take the match and append standard params for size if needed
            let imgUrl = match[0];
            // Decode entities if any
            imgUrl = imgUrl.replace(/&amp;/g, '&');

            // Unsplash URLs in source might be very long with auto-format.
            // Let's try to just get the ID?
            // "https://images.unsplash.com/photo-1585232561025-a1850d09907c?..."

            console.log('Found URL:', imgUrl);
        } else {
            console.log('No image found in HTML.');
            // console.log(html.slice(0, 500)); // Debug
        }

    } catch (e) {
        console.error('Error fetching:', e);
    }
}

main();
