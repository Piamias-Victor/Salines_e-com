import { useState, useEffect } from 'react';

interface ShippingRate {
    id: string;
    minWeight: number;
    maxWeight: number;
    price: number;
}

interface ShippingMethod {
    id: string;
    name: string;
    type: 'PHARMACY' | 'HOME' | 'RELAY';
    description: string;
    isActive: boolean;
    freeShippingThreshold: number | null;
    rates: ShippingRate[];
}

export function useShippingSettings() {
    const [methods, setMethods] = useState<ShippingMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    const fetchMethods = async () => {
        try {
            const res = await fetch('/api/admin/shipping-methods');
            const data = await res.json();
            const order = ['PHARMACY', 'HOME', 'RELAY'];
            const sorted = data.sort((a: ShippingMethod, b: ShippingMethod) =>
                order.indexOf(a.type) - order.indexOf(b.type)
            );
            setMethods(sorted);
        } catch (error) {
            console.error('Error fetching methods:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const toggleActive = async (method: ShippingMethod) => {
        try {
            const res = await fetch('/api/admin/shipping-methods', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: method.id,
                    isActive: !method.isActive,
                    freeShippingThreshold: method.freeShippingThreshold,
                }),
            });
            if (res.ok) await fetchMethods();
        } catch (error) {
            console.error('Error toggling active:', error);
        }
    };

    const updateThreshold = async (method: ShippingMethod, value: string) => {
        try {
            const res = await fetch('/api/admin/shipping-methods', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: method.id,
                    isActive: method.isActive,
                    freeShippingThreshold: value === '' ? null : parseFloat(value),
                }),
            });
            if (res.ok) await fetchMethods();
        } catch (error) {
            console.error('Error updating threshold:', error);
        }
    };

    const addRate = async (methodId: string) => {
        try {
            const res = await fetch('/api/admin/shipping-rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingMethodId: methodId,
                    minWeight: 0,
                    maxWeight: 10,
                    price: 5,
                }),
            });
            if (res.ok) await fetchMethods();
        } catch (error) {
            console.error('Error adding rate:', error);
        }
    };

    const updateRate = (methodId: string, rateId: string, field: 'minWeight' | 'maxWeight' | 'price', value: string) => {
        setMethods((prev) =>
            prev.map((method) => {
                if (method.id !== methodId) return method;
                return {
                    ...method,
                    rates: method.rates.map((rate) => {
                        if (rate.id !== rateId) return rate;
                        return { ...rate, [field]: parseFloat(value) };
                    }),
                };
            })
        );
    };

    const saveAllRates = async () => {
        setSavingId('all');
        try {
            const promises = methods.flatMap((method) =>
                method.rates.map((rate) =>
                    fetch('/api/admin/shipping-rates', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: rate.id,
                            minWeight: rate.minWeight,
                            maxWeight: rate.maxWeight,
                            price: rate.price,
                        }),
                    })
                )
            );
            await Promise.all(promises);
            await fetchMethods();
        } catch (error) {
            console.error('Error updating rates:', error);
        } finally {
            setSavingId(null);
        }
    };

    const deleteRate = async (rateId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) return;
        try {
            const res = await fetch(`/api/admin/shipping-rates?id=${rateId}`, {
                method: 'DELETE',
            });
            if (res.ok) await fetchMethods();
        } catch (error) {
            console.error('Error deleting rate:', error);
        }
    };

    return {
        methods,
        isLoading,
        savingId,
        toggleActive,
        updateThreshold,
        addRate,
        updateRate,
        saveAllRates,
        deleteRate,
    };
}
