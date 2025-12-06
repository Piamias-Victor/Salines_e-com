'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export type DeliveryMode = 'PHARMACY' | 'HOME' | 'RELAY';

export interface Address {
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    id?: string;
    isDefault?: boolean;
}

interface CheckoutContextType {
    // State
    step: number;
    guestEmail: string | null;
    deliveryMode: DeliveryMode | null;
    shippingAddress: Address | null;
    billingAddress: Address | null;
    isSameAddress: boolean;

    // Actions
    setGuestEmail: (email: string) => void;
    setDeliveryMode: (mode: DeliveryMode) => void;
    setShippingAddress: (address: Address) => void;
    setBillingAddress: (address: Address) => void;
    setIsSameAddress: (isSame: boolean) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [guestEmail, setGuestEmail] = useState<string | null>(null);
    const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [isSameAddress, setIsSameAddress] = useState(true);

    // If user is logged in, auto-fill email and skip step 1 if on it
    useEffect(() => {
        if (user) {
            setGuestEmail(user.email);
            if (step === 1) {
                // If we are on step 1 and user logs in, move to step 2
                // But we need to be careful not to redirect if we are just mounting
                // For now, let's handle redirection in the page component
            }
        }
    }, [user, step]);

    const nextStep = () => {
        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setStep((prev) => Math.max(1, prev - 1));
    };

    return (
        <CheckoutContext.Provider
            value={{
                step,
                guestEmail,
                deliveryMode,
                shippingAddress,
                billingAddress,
                isSameAddress,
                setGuestEmail,
                setDeliveryMode,
                setShippingAddress,
                setBillingAddress,
                setIsSameAddress,
                nextStep,
                prevStep,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (context === undefined) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}
