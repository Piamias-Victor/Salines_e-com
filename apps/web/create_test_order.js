const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestOrder() {
    try {
        // 1. Create a test product if needed (or use existing)
        let product = await prisma.product.findFirst();
        if (!product) {
            console.log('Creating test product...');
            product = await prisma.product.create({
                data: {
                    name: 'Produit Test',
                    slug: 'produit-test-' + Date.now(),
                    priceHT: 10,
                    priceTTC: 12,
                    stock: 100,
                    description: 'Description test',
                    images: ['https://via.placeholder.com/150'],
                    categoryId: 'test-cat', // Assumes category exists or is optional/handled
                    brandId: 'test-brand'
                }
            });
        }

        // 2. Create Order
        const orderNumber = `CMD-${Date.now()}`;
        console.log(`Creating order ${orderNumber}...`);

        const order = await prisma.order.create({
            data: {
                orderNumber,
                guestEmail: 'test@example.com',
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                paymentMethod: 'carte_bancaire',
                subtotal: 24,
                shippingCost: 5,
                tax: 0,
                total: 29,
                items: {
                    create: [
                        {
                            productId: product.id,
                            quantity: 2,
                            price: product.priceTTC,
                            status: 'PENDING'
                        }
                    ]
                },
                // Optional addresses (since we made them optional)
                shippingAddress: {
                    create: {
                        firstName: 'Jean',
                        lastName: 'Dupont',
                        street: '123 Rue du Test',
                        city: 'Paris',
                        postalCode: '75001',
                        country: 'France',
                        phone: '0601020304'
                    }
                },
                billingAddress: {
                    create: {
                        firstName: 'Jean',
                        lastName: 'Dupont',
                        street: '123 Rue du Test',
                        city: 'Paris',
                        postalCode: '75001',
                        country: 'France'
                    }
                }
            }
        });

        console.log('✅ Order created successfully!');
        console.log('ID:', order.id);
        console.log('Number:', order.orderNumber);

    } catch (e) {
        console.error('Error creating order:', e);
    } finally {
        await prisma.$disconnect();
    }
}

createTestOrder();
