import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cartId, userId, email } = body;

        if (!cartId) {
            return NextResponse.json(
                { error: 'Cart ID is required' },
                { status: 400 }
            );
        }

        // Fetch cart with items and products
        const cart = await prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty or not found' },
                { status: 404 }
            );
        }

        // Calculate subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + Number(item.product.priceTTC) * item.quantity;
        }, 0);

        // Calculate shipping cost
        let shippingCost = 0;
        if (cart.shippingMethodId) {
            const totalWeight = cart.items.reduce((sum, item) => {
                return sum + (Number(item.product.weight) || 0) * item.quantity;
            }, 0);

            const shippingRate = await prisma.shippingRate.findFirst({
                where: {
                    shippingMethodId: cart.shippingMethodId,
                    minWeight: { lte: totalWeight },
                    maxWeight: { gte: totalWeight },
                },
                include: {
                    shippingMethod: true,
                },
            });

            if (shippingRate) {
                // Check if free shipping threshold is met
                const freeShippingThreshold = shippingRate.shippingMethod.freeShippingThreshold;
                if (!freeShippingThreshold || subtotal < Number(freeShippingThreshold)) {
                    shippingCost = Number(shippingRate.price);
                }
            }
        }

        // Calculate total
        const total = subtotal + shippingCost;

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Stripe uses cents
            currency: 'eur',
            receipt_email: email, // Set receipt email for Stripe
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                cartId,
                userId: userId || 'guest',
                subtotal: subtotal.toFixed(2),
                shippingCost: shippingCost.toFixed(2),
                total: total.toFixed(2),
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: total,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}
