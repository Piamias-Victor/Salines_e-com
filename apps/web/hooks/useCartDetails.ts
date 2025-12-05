import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        priceTTC: number;
        priceHT: number;
        imageUrl: string | null;
        stock: number;
    };
}

interface CartDetails {
    id: string;
    userId: string | null;
    sessionToken: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        createdAt: string;
    } | null;
    items: CartItem[];
    shippingMethod: {
        id: string;
        name: string;
        description: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    stats: {
        itemCount: number;
        subtotal: number;
    };
}

export function useCartDetails(cartId: string) {
    const router = useRouter();
    const [cart, setCart] = useState<CartDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCartDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/carts/${cartId}`);
            if (!response.ok) throw new Error('Cart not found');
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart details:', error);
            router.push('/dashboard/carts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cartId) {
            fetchCartDetails();
        }
    }, [cartId]);

    return {
        cart,
        loading,
        fetchCartDetails,
    };
}
