import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    status: string;
    product: {
        id: string;
        name: string;
        sku: string | null;
        imageUrl: string | null;
    };
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string | null;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
    } | null;
    guestEmail: string | null;
    shippingAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string | null;
    } | null;
    billingAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    items: OrderItem[];
}

export function useOrderDetails(orderId: string) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`);
            if (!response.ok) throw new Error('Order not found');
            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
            router.push('/dashboard/orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const updateStatus = async (newStatus: string) => {
        if (!confirm('Êtes-vous sûr de vouloir changer le statut de cette commande ?')) return false;

        setUpdating(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            await fetchOrder();
            return true;
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour du statut');
            return false;
        } finally {
            setUpdating(false);
        }
    };

    return {
        order,
        loading,
        updating,
        fetchOrder,
        updateStatus,
    };
}
