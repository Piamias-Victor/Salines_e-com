'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckout } from '@/contexts/CheckoutContext';
import { LoginForm } from '@/components/checkout/LoginForm';
import { GuestCheckoutForm } from '@/components/checkout/GuestCheckoutForm';

export default function CheckoutLoginPage() {
    const router = useRouter();
    const { user, login } = useAuth();
    const { setGuestEmail } = useCheckout();
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/checkout/delivery');
        }
    }, [user, router]);

    const handleGuestSubmit = (email: string) => {
        setGuestEmail(email);
        router.push('/checkout/delivery');
    };

    const handleLoginSubmit = async (email: string, password: string) => {
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de connexion');
            throw err;
        }
    };

    if (user) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-[#fe0090]" size={32} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <LoginForm onSubmit={handleLoginSubmit} error={error} />
            <GuestCheckoutForm onSubmit={handleGuestSubmit} />
        </div>
    );
}
