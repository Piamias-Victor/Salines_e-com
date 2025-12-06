import { syncWinPharmaProducts } from '@/lib/winpharma/sync';
import { prisma } from '@/lib/prisma';

async function main() {
    console.log('🚀 Starting Manual WinPharma Sync...');
    try {
        const result = await syncWinPharmaProducts();
        console.log('✅ Sync completed successfully!');
        console.log('Stats:', result);
    } catch (error) {
        console.error('❌ Sync failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
