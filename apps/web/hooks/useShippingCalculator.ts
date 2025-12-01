import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

interface ShippingMethod {
    id: string;
    name: string;
    type: string;
    description: string;
    freeShippingThreshold: number | null;
    rates: Array<{
        id: string;
        minWeight: number;
        maxWeight: number;
        price: number;
    }>;
}

export function useShippingCalculator() {
    const { getTotalWeight, getTotalPrice } = useCart();
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [shippingCosts, setShippingCosts] = useState<Record<string, number>>({});

    // Fetch shipping methods
    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const res = await fetch('/api/shipping/methods');
                const data = await res.json();
                setShippingMethods(data);
            } catch (error) {
                console.error('Error fetching shipping methods:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMethods();
    }, []);

    // Calculate shipping costs
    useEffect(() => {
        if (shippingMethods.length === 0) return;

        const cartWeight = getTotalWeight();
        const cartTotal = getTotalPrice();
        const costs: Record<string, number> = {};

        for (const method of shippingMethods) {
            if (method.type === 'PHARMACY') {
                costs[method.type] = 0;
            } else if (method.rates.length > 0) {
                const rate = method.rates.find(
                    (r) => cartWeight >= Number(r.minWeight) && cartWeight <= Number(r.maxWeight)
                );

                if (rate) {
                    const basePrice = Number(rate.price);
                    if (method.freeShippingThreshold && cartTotal >= Number(method.freeShippingThreshold)) {
                        costs[method.type] = 0;
                    } else {
                        costs[method.type] = basePrice;
                    }
                } else {
                    costs[method.type] = 0;
                }
            }
        }

        setShippingCosts(costs);
    }, [shippingMethods, getTotalWeight, getTotalPrice]);

    return {
        shippingMethods,
        shippingCosts,
        isLoading,
    };
}
