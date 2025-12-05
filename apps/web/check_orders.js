const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrders() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { items: true }
        });

        console.log('Total orders found:', orders.length);
        orders.forEach(o => {
            console.log(`Order: ${o.orderNumber}, Status: ${o.status}, Created: ${o.createdAt}`);
            console.log(`Items: ${o.items.length}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkOrders();
