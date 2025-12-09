import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cartId, userId, email, medicalInfo } = body;

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

        // Validate medical info if medicines are present
        const hasMedicines = cart.items.some(item => item.product.isMedicament);
        if (hasMedicines) {
            if (!medicalInfo || !medicalInfo.height || !medicalInfo.weight || !medicalInfo.agreement) {
                return NextResponse.json(
                    { error: 'Medical information is required for products containing medication' },
                    { status: 400 }
                );
            }
        }

        // Calculate subtotal using applied promotion prices
        const subtotal = cart.items.reduce((sum: number, item: any) => {
            // Use applied promotion price if exists, otherwise use regular price
            const price = item.appliedPromotionPrice
                ? Number(item.appliedPromotionPrice)
                : Number(item.product.priceTTC);
            return sum + (price * item.quantity);
        }, 0);

        // Calculate Promo Code Discount
        let promoDiscount = 0;
        let promoCode = null;
        if (cart.appliedPromoCode) {
            promoCode = await prisma.promoCode.findUnique({
                where: { code: cart.appliedPromoCode },
            });

            if (promoCode && promoCode.isActive) {
                // Verify validity (dates, limits) - simplified here as it should be validated on apply
                // But good to double check dates
                const now = new Date();
                if ((!promoCode.startDate || promoCode.startDate <= now) &&
                    (!promoCode.endDate || promoCode.endDate >= now)) {

                    if (promoCode.discountType === 'PERCENTAGE') {
                        promoDiscount = (subtotal * Number(promoCode.discountAmount)) / 100;
                    } else {
                        promoDiscount = Number(promoCode.discountAmount);
                    }
                }
            }
        }

        const subtotalAfterDiscount = Math.max(0, subtotal - promoDiscount);

        // Calculate shipping cost
        let shippingCost = 0;

        // Check for free shipping from promo code
        let isFreeShippingViaCode = promoCode?.freeShipping;

        // If restricted to a specific method, verify it matches
        if (isFreeShippingViaCode && promoCode?.freeShippingMethodId) {
            if (cart.shippingMethodId !== promoCode.freeShippingMethodId) {
                isFreeShippingViaCode = false;
            }
        }

        if (cart.shippingMethodId && !isFreeShippingViaCode) {
            const totalWeight = cart.items.reduce((sum: number, item: any) => {
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
                // Check if free shipping threshold is met (using subtotal after discount)
                const freeShippingThreshold = shippingRate.shippingMethod.freeShippingThreshold;
                if (!freeShippingThreshold || subtotalAfterDiscount < Number(freeShippingThreshold)) {
                    shippingCost = Number(shippingRate.price);
                }
            }
        }

        // Calculate total
        const total = subtotalAfterDiscount + shippingCost;

        // Prepare metadata
        const metadata: any = {
            cartId,
            userId: userId || 'guest',
            subtotal: subtotal.toFixed(2),
            promoDiscount: promoDiscount.toFixed(2),
            promoCode: promoCode?.code || null,
            shippingCost: shippingCost.toFixed(2),
            total: total.toFixed(2),
        };

        if (medicalInfo) {
            metadata.medical_height = medicalInfo.height;
            metadata.medical_weight = medicalInfo.weight;
            metadata.medical_agreement = String(medicalInfo.agreement);
        }

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Stripe uses cents
            currency: 'eur',
            receipt_email: email, // Set receipt email for Stripe
            automatic_payment_methods: {
                enabled: true,
            },
            metadata,
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
