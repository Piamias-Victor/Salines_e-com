
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const brand = await prisma.brand.findFirst({ where: { name: '3 CHÊNES' } });
    console.log('Brand validation:', brand);
}
run();
