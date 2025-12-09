'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { MedicalAssessmentModal } from '@/components/checkout/MedicalAssessmentModal';
import { Loader2, ShoppingBag, Truck } from 'lucide-react';
import { useCartContext } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/utils';

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
    const [medicalInfo, setMedicalInfo] = useState<{ height: number; weight: number; agreement: boolean } | null>(null);
    const [showMedicalModal, setShowMedicalModal] = useState(false);

    // Initial check for medicines
    useEffect(() => {
        if (cart?.items.some(item => item.product.isMedicament) && !medicalInfo && !clientSecret) {
            setShowMedicalModal(true);
        } else if (!clientSecret && cart) {
            // Initiate payment intent only if no medicines OR medical info is provided
            createPaymentIntent();
        }
    }, [cart, medicalInfo, clientSecret]);

    const createPaymentIntent = async () => {
        try {
            if (!cart || cart.items.length === 0) {
                router.push('/cart');
                return;
            }

            setLoading(true);
            const response = await fetch('/api/checkout/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartId: cart.id,
                    userId: user?.id,
                    email: user?.email || guestEmail,
                    medicalInfo // Pass collected medical info
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

    const handleMedicalConfirm = (info: { height: number; weight: number; agreement: boolean }) => {
        setMedicalInfo(info);
        setShowMedicalModal(false);
        // Payment intent creation will be triggered by useEffect
    };

    const handlePaymentSuccess = (paymentIntentId: string) => {
        // Clear cart
        clearCart();
        // Redirect to success page
        router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
    };

    const handlePaymentError = (error: string) => {
        setError(error);
    };

    if (loading && !showMedicalModal) {
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

    // if (!clientSecret) {
    //     return null; // Don't return null if modal is showing
    // }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <MedicalAssessmentModal
                isOpen={showMedicalModal}
                onConfirm={handleMedicalConfirm}
                onCancel={() => router.push('/cart')} // Go back if they cancel
            />

            {clientSecret && (
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
                                            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {(item.product.imageUrl || (item.product as any).images?.[0]?.url) ? (
                                                    <Image
                                                        src={item.product.imageUrl || (item.product as any).images?.[0]?.url}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <ShoppingBag size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                {item.appliedPromotionPrice ? (
                                                    <>
                                                        <p className="text-sm font-semibold text-[#fe0090]">
                                                            {formatPrice(item.appliedPromotionPrice * item.quantity)}
                                                        </p>
                                                        <p className="text-xs text-gray-400 line-through">
                                                            {formatPrice(item.product.priceTTC * item.quantity)}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(Number(item.product.priceTTC) * item.quantity)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Sous-total</span>
                                        <span className="font-medium text-gray-900">{formatPrice(amount)}</span>
                                    </div>

                                    {(() => {
                                        const originalTotal = cart?.items.reduce((acc, item) => acc + (Number(item.product.priceTTC) * item.quantity), 0) || 0;
                                        const savings = originalTotal - amount;
                                        return savings > 0 ? (
                                            <div className="flex justify-between text-sm text-emerald-600">
                                                <span className="font-medium">🎉 Économies</span>
                                                <span className="font-bold">-{formatPrice(savings)}</span>
                                            </div>
                                        ) : null;
                                    })()}

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
                                    <span className="text-2xl font-bold text-[#fe0090]">{formatPrice(amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
