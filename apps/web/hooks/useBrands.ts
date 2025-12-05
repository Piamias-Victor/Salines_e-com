import { useState, useEffect } from 'react';

interface Brand {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    position: number;
    isActive: boolean;
}

export function useBrands() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/brands');
            if (!res.ok) throw new Error('Failed to fetch brands');

            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error('API returned non-array data:', data);
                throw new Error('Invalid data format received');
            }

            const sortedBrands = data.sort((a: Brand, b: Brand) => a.name.localeCompare(b.name));
            setBrands(sortedBrands);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const deleteBrand = async (id: string) => {
        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchBrands();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting brand:', error);
            return false;
        }
    };

    return {
        brands,
        loading,
        fetchBrands,
        deleteBrand,
    };
}
