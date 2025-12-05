import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { mailService } from '@/lib/services/mail';

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    console.log('[WEBHOOK] Received event');
    console.log('[WEBHOOK] Signature:', sig ? 'Present' : 'Missing');

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        console.log('[WEBHOOK] Event constructed:', event.type);
    } catch (err: any) {
        console.error(`[WEBHOOK] Error verifying webhook signature: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('[WEBHOOK] Payment succeeded:', paymentIntent.id);
                console.log('[WEBHOOK] Metadata:', paymentIntent.metadata);

                const { cartId, userId } = paymentIntent.metadata;

                if (!cartId) {
                    console.error('[WEBHOOK] No cartId in metadata');
                    break;
                }
                await handlePaymentSuccess(paymentIntent);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.error('Payment failed:', paymentIntent.id);
                // TODO: Send email notification to user
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge;
                await handleRefund(charge);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { cartId, userId, subtotal, shippingCost, total } = paymentIntent.metadata;

    if (!cartId) {
        console.error('No cartId in payment intent metadata');
        return;
    }

    // Fetch cart with items
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

    if (!cart) {
        console.error('Cart not found:', cartId);
        return;
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create order
    // Note: This is simplified - you'll need to handle addresses properly
    const order = await prisma.order.create({
        data: {
            orderNumber,
            userId: userId !== 'guest' ? userId : null,
            guestEmail: userId === 'guest' ? 'guest@example.com' : null, // TODO: Get from checkout form
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            paymentMethod: 'stripe',
            paidAt: new Date(),
            subtotal: Number(subtotal),
            shippingCost: Number(shippingCost),
            tax: 0, // TODO: Calculate tax if needed
            total: Number(total),
            stripePaymentIntentId: paymentIntent.id,
            stripeChargeId: paymentIntent.latest_charge as string,
            // Addresses will be added later when checkout flow is complete
            shippingAddressId: undefined as any,
            billingAddressId: undefined as any,
            items: {
                create: cart.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.priceTTC,
                })),
            },
        },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
        where: { cartId },
    });

    console.log('Order created successfully:', order.orderNumber);

    // Send confirmation email
    try {
        console.log('Attempting to send confirmation email...');
        let email = paymentIntent.receipt_email;
        let firstName = 'Client';

        console.log('Initial email from paymentIntent:', email);
        console.log('UserId:', userId);

        if (userId !== 'guest') {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user) {
                email = user.email;
                firstName = user.firstName;
                console.log('Fetched user email from DB:', email);
            } else {
                console.log('User not found in DB for ID:', userId);
            }
        } else if (!email) {
            console.log('Guest user and no receipt_email found.');
            // Fallback for guest if receipt_email is missing (shouldn't happen if Link is used or configured)
            // email = 'guest@example.com'; // Don't use fallback for now to see if it fails
        }

        if (email) {
            console.log(`Sending email to ${email} for order ${orderNumber}`);
            await mailService.sendOrderConfirmation(email, orderNumber, firstName, Number(total));
            console.log('Email sent successfully');
        } else {
            console.error('No email address found to send confirmation');
        }
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
    }
}

async function handleRefund(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string;

    if (!paymentIntentId) {
        console.error('No payment intent ID in charge');
        return;
    }

    // Find order by payment intent ID
    const order = await prisma.order.findFirst({
        where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!order) {
        console.error('Order not found for payment intent:', paymentIntentId);
        return;
    }

    // Update order status
    await prisma.order.update({
        where: { id: order.id },
        data: {
            status: 'REFUNDED',
            paymentStatus: 'REFUNDED',
        },
    });

    console.log('Order refunded:', order.orderNumber);

    // TODO: Send refund confirmation email
}
