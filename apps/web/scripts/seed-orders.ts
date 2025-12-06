import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'sasphardev@gmail.com';

    console.log(`Looking for user ${email}...`);
    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`User ${email} not found. Creating user...`);
        user = await prisma.user.create({
            data: {
                email,
                firstName: 'Victor',
                lastName: 'Piamias',
                password: 'password123', // In a real app this should be hashed
                role: 'CUSTOMER',
                emailVerified: true,
            }
        });
    }

    console.log(`Found user ${user.id}. Creating orders...`);

    // Get some products
    const products = await prisma.product.findMany({
        take: 3,
    });

    if (products.length === 0) {
        console.error('No products found in database!');
        return;
    }

    // Create Order 1: Delivered
    await prisma.order.create({
        data: {
            orderNumber: `CMD-${Date.now()}-1`,
            userId: user.id,
            status: 'DELIVERED',
            subtotal: 45.50,
            shippingCost: 4.90,
            tax: 9.10,
            total: 50.40,
            paymentStatus: 'PAID',
            items: {
                create: [
                    {
                        productId: products[0].id,
                        quantity: 2,
                        price: 15.00,
                        status: 'SHIPPED',
                    },
                    {
                        productId: products[1].id,
                        quantity: 1,
                        price: 15.50,
                        status: 'SHIPPED',
                    }
                ]
            }
        }
    });

    // Create Order 2: Processing
    await prisma.order.create({
        data: {
            orderNumber: `CMD-${Date.now()}-2`,
            userId: user.id,
            status: 'PROCESSING',
            subtotal: 25.00,
            shippingCost: 0,
            tax: 5.00,
            total: 25.00,
            paymentStatus: 'PAID',
            items: {
                create: [
                    {
                        productId: products[1] ? products[1].id : products[0].id,
                        quantity: 1,
                        price: 25.00,
                        status: 'PREPARING',
                    }
                ]
            }
        }
    });

    console.log('Orders created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
