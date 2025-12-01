'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckout, type DeliveryMode, type Address } from '@/contexts/CheckoutContext';
import { useShippingCalculator } from '@/hooks/useShippingCalculator';
import { AddressForm } from '@/components/checkout/AddressForm';
import { DeliveryModeSelector } from '@/components/checkout/DeliveryModeSelector';

export default function CheckoutDeliveryPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { guestEmail, deliveryMode, setDeliveryMode, setShippingAddress, setBillingAddress, isSameAddress } = useCheckout();
    const { shippingMethods, shippingCosts, isLoading } = useShippingCalculator();

    const [formData, setFormData] = useState<Address>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        company: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: 'France',
        phone: user?.phone || '',
    });

    const [acceptSamples, setAcceptSamples] = useState(false);

    // Redirect if no email
    useEffect(() => {
        if (!user && !guestEmail) {
            router.push('/checkout/login');
        }
    }, [user, guestEmail, router]);

    const isAddressValid = !!(formData.addressLine1 && formData.city && formData.postalCode && formData.firstName && formData.lastName);
    const isContactValid = !!(formData.firstName && formData.lastName && formData.phone);

    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        if (!deliveryMode) return;

        // Validation
        if (deliveryMode === 'PHARMACY') {
            if (!isContactValid) {
                alert('Veuillez remplir les informations de contact');
                return;
            }
        } else {
            if (!isAddressValid) {
                alert("Veuillez remplir l'adresse de livraison");
                return;
            }
        }

        setShippingAddress(formData);
        if (isSameAddress) {
            setBillingAddress(formData);
        }

        router.push('/checkout/payment');
    }, [deliveryMode, isContactValid, isAddressValid, setShippingAddress, setBillingAddress, isSameAddress, formData, router]);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#3f4c53] mb-8">Livraison</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Address Form */}
                <div className="lg:col-span-7">
                    <AddressForm formData={formData} onChange={handleAddressChange} />
                </div>

                {/* Right: Delivery Modes */}
                <div className="lg:col-span-5 space-y-6">
                    <DeliveryModeSelector
                        shippingMethods={shippingMethods}
                        shippingCosts={shippingCosts}
                        selectedMode={deliveryMode}
                        isLoading={isLoading}
                        isAddressValid={isAddressValid}
                        onSelectMode={setDeliveryMode}
                    />

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center h-6 relative">
                            <input
                                id="samples"
                                name="samples"
                                type="checkbox"
                                checked={acceptSamples}
                                onChange={(e) => setAcceptSamples(e.target.checked)}
                                className="peer h-5 w-5 opacity-0 absolute inset-0 cursor-pointer z-10"
                            />
                            <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${acceptSamples
                                ? 'bg-[#fe0090] border-[#fe0090]'
                                : 'bg-white border-gray-300 peer-hover:border-[#fe0090]'
                                }`}>
                                {acceptSamples && <Check size={14} className="text-white stroke-[3]" />}
                            </div>
                        </div>
                        <label htmlFor="samples" className="text-sm text-gray-600 cursor-pointer select-none">
                            J'accepte de recevoir des échantillons de produit (envoi selon disponibilité).
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!deliveryMode || !isAddressValid}
                        className="w-full bg-[#fe0090] text-white font-bold py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <span>Continuer vers le paiement</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
