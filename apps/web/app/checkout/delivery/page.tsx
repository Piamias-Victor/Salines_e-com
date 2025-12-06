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
    const { user, accessToken } = useAuth();
    const { guestEmail, deliveryMode, setDeliveryMode, setShippingAddress, setBillingAddress, isSameAddress } = useCheckout();
    const { shippingMethods, shippingCosts, isLoading } = useShippingCalculator();

    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
    const [saveNewAddress, setSaveNewAddress] = useState(false);

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

    // Fetch saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (user && accessToken) {
                try {
                    const response = await fetch('/api/user/addresses', {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setSavedAddresses(data);
                        // Select default address if exists
                        const defaultAddress = data.find((a: any) => a.isDefault);
                        if (defaultAddress) {
                            setSelectedAddressId(defaultAddress.id);
                            setFormData(defaultAddress);
                        } else if (data.length > 0) {
                            setSelectedAddressId(data[0].id);
                            setFormData(data[0]);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                }
            }
        };
        fetchAddresses();
    }, [user, accessToken]);

    const handleAddressSelection = (addressId: string) => {
        setSelectedAddressId(addressId);
        if (addressId === 'new') {
            setFormData({
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
        } else {
            const address = savedAddresses.find(a => a.id === addressId);
            if (address) {
                setFormData(address);
            }
        }
    };

    const isAddressValid = !!(formData.addressLine1 && formData.city && formData.postalCode && formData.firstName && formData.lastName);
    const isContactValid = !!(formData.firstName && formData.lastName && formData.phone);

    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (selectedAddressId !== 'new') {
            setSelectedAddressId('new'); // Switch to new if editing a saved address
        }
    }, [selectedAddressId]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
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

        setIsSubmitting(true);

        try {
            // Save new address if requested
            if (saveNewAddress && selectedAddressId === 'new' && user && accessToken) {
                await fetch('/api/user/addresses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        isDefault: savedAddresses.length === 0, // Default if first address
                    }),
                });
            }

            // Find selected shipping method ID
            const selectedMethod = shippingMethods.find(m => m.type === deliveryMode);

            if (selectedMethod) {
                // Update cart with shipping method
                await fetch('/api/cart', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ shippingMethodId: selectedMethod.id }),
                });
            }

            setShippingAddress(formData);
            if (isSameAddress) {
                setBillingAddress(formData);
            }

            router.push('/checkout/payment');
        } catch (error) {
            console.error('Error updating cart:', error);
            router.push('/checkout/payment');
        } finally {
            setIsSubmitting(false);
        }
    }, [deliveryMode, isContactValid, isAddressValid, setShippingAddress, setBillingAddress, isSameAddress, formData, router, shippingMethods, saveNewAddress, selectedAddressId, user, accessToken, savedAddresses.length]);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#3f4c53] mb-8">Livraison</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Address Form */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Saved Addresses Selector */}
                    {savedAddresses.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-[#3f4c53] mb-4">Mes adresses</h2>
                            <div className="space-y-3">
                                {savedAddresses.map((address: any) => (
                                    <label
                                        key={address.id}
                                        className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === address.id
                                                ? 'border-[#fe0090] bg-pink-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="addressSelection"
                                            value={address.id}
                                            checked={selectedAddressId === address.id}
                                            onChange={() => handleAddressSelection(address.id)}
                                            className="mt-1 w-4 h-4 text-[#fe0090] focus:ring-[#fe0090]"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900">
                                                    {address.firstName} {address.lastName}
                                                </span>
                                                {address.isDefault && (
                                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                                                        Défaut
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {address.addressLine1}, {address.postalCode} {address.city}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                                <label
                                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === 'new'
                                            ? 'border-[#fe0090] bg-pink-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="addressSelection"
                                        value="new"
                                        checked={selectedAddressId === 'new'}
                                        onChange={() => handleAddressSelection('new')}
                                        className="w-4 h-4 text-[#fe0090] focus:ring-[#fe0090]"
                                    />
                                    <span className="font-medium text-gray-900">Utiliser une nouvelle adresse</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <AddressForm formData={formData} onChange={handleAddressChange} />

                    {/* Save Address Checkbox */}
                    {user && selectedAddressId === 'new' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={saveNewAddress}
                                    onChange={(e) => setSaveNewAddress(e.target.checked)}
                                    className="w-5 h-5 text-[#fe0090] border-gray-300 rounded focus:ring-[#fe0090]"
                                />
                                <span className="text-gray-700">Sauvegarder cette adresse pour mes prochaines commandes</span>
                            </label>
                        </div>
                    )}
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
                        disabled={!deliveryMode || !isAddressValid || isSubmitting}
                        className="w-full bg-[#fe0090] text-white font-bold py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isSubmitting ? (
                            <span>Chargement...</span>
                        ) : (
                            <>
                                <span>Continuer vers le paiement</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
