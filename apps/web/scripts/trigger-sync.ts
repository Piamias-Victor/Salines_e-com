import { syncWinPharmaProducts } from '../lib/winpharma/sync';
import { prisma } from '../lib/prisma';

async function main() {
    console.log('🧪 Testing WinPharma Sync...');
    try {
        const result = await syncWinPharmaProducts();
        console.log('Sync Result:', result);

        // Verify a few products
        const count = await prisma.product.count();
        console.log(`Total products in DB: ${count}`);

        const sample = await prisma.product.findFirst();
        if (sample) {
            console.log('Sample Product:', {
                name: sample.name,
                ean: sample.ean,
                stock: sample.stock,
                priceTTC: sample.priceTTC,
                priceHT: sample.priceHT
            });
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
