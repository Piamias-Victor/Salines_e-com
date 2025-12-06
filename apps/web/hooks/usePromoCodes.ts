import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface PromoCode {
    id: string;
    code: string;
    description?: string;
    discountType: 'EURO' | 'PERCENTAGE';
    discountAmount: number;
    minCartAmount?: number;
    freeShipping: boolean;
    freeShippingMethodId?: string | null;
    usageLimit?: number;
    usageCount: number;
    perUserLimit?: number;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export function usePromoCodes() {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const response = await fetch('/api/admin/promo-codes');
            if (response.ok) {
                const data = await response.json();
                setPromoCodes(data);
            }
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePromoCode = async (id: string) => {
        try {
            setSaving(true);
            const response = await fetch(`/api/admin/promo-codes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPromoCodes(prev => prev.filter(p => p.id !== id));
                router.refresh();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting promo code:', error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/admin/promo-codes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (response.ok) {
                setPromoCodes(prev => prev.map(p =>
                    p.id === id ? { ...p, isActive: !currentStatus } : p
                ));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error toggling promo code status:', error);
            return false;
        }
    };

    return {
        promoCodes,
        loading,
        saving,
        fetchPromoCodes,
        deletePromoCode,
        toggleActive
    };
}
