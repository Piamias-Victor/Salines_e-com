'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { Loader2, ShoppingBag, Truck } from 'lucide-react';
import { useCartContext } from '@/components/providers/CartProvider';

import { useAuth } from '@/contexts/AuthContext';
import { useCheckout } from '@/contexts/CheckoutContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPaymentPage() {
    const router = useRouter();
    const { cart, clearCart } = useCartContext();
    const { user } = useAuth();
    const { guestEmail } = useCheckout();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Create payment intent when page loads
        const createPaymentIntent = async () => {
            try {
                if (!cart || cart.items.length === 0) {
                    router.push('/cart');
                    return;
                }

                const response = await fetch('/api/checkout/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cartId: cart.id,
                        userId: user?.id,
                        email: user?.email || guestEmail,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create payment intent');
                }

                const data = await response.json();
                setClientSecret(data.clientSecret);
                setAmount(data.amount);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        createPaymentIntent();
    }, [cart, router]);

    const handlePaymentSuccess = (paymentIntentId: string) => {
        // Clear cart
        clearCart();
        // Redirect to success page
        router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
    };

    const handlePaymentError = (error: string) => {
        setError(error);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-[#fe0090]" size={48} />
                    <p className="text-gray-600">Préparation du paiement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/cart')}
                        className="bg-[#fe0090] text-white px-6 py-3 rounded-xl hover:bg-[#e0007f] transition-colors"
                    >
                        Retour au panier
                    </button>
                </div>
            </div>
        );
    }

    if (!clientSecret) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">Paiement</h1>
                    <p className="text-gray-600">Finalisez votre commande en toute sécurité</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                    variables: {
                                        colorPrimary: '#fe0090',
                                        borderRadius: '12px',
                                    },
                                },
                            }}
                        >
                            <PaymentForm
                                amount={amount}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                            />
                        </Elements>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Récapitulatif
                            </h3>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                {cart?.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <ShoppingBag size={20} className="text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {(Number(item.product.priceTTC) * item.quantity).toFixed(2)} €
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sous-total</span>
                                    <span className="font-medium text-gray-900">{amount.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <Truck size={14} />
                                        Livraison
                                    </span>
                                    <span className="font-medium text-green-600">Gratuite</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-[#fe0090]">{amount.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
