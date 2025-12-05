import { useState, useEffect } from 'react';

interface Promotion {
    id: string;
    title: string;
    imageUrl: string;
    amount: number;
    type: 'EURO' | 'PERCENT';
    position: number;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
}

export function usePromotions() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/promotions');
            const data = await res.json();
            setPromotions(data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const deletePromotion = async (id: string) => {
        try {
            const res = await fetch(`/api/promotions/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchPromotions();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting promotion:', error);
            return false;
        }
    };

    const updatePositions = async (newPromotions: Promotion[]) => {
        setPromotions(newPromotions);

        const updates = newPromotions.map((p, index) => ({
            id: p.id,
            position: index + 1,
        }));

        setSaving(true);
        try {
            const res = await fetch('/api/promotions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates }),
            });

            if (!res.ok) throw new Error('Failed to update positions');
            await fetchPromotions();
            return true;
        } catch (error) {
            console.error('Error updating positions:', error);
            await fetchPromotions();
            return false;
        } finally {
            setSaving(false);
        }
    };

    return {
        promotions,
        loading,
        saving,
        fetchPromotions,
        deletePromotion,
        updatePositions,
    };
}
