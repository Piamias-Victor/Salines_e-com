import { useState, useEffect } from 'react';

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    position: number;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
}

export function useBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/banners');
            const data = await res.json();
            setBanners(data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const deleteBanner = async (id: string) => {
        try {
            const res = await fetch(`/api/banners/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchBanners();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting banner:', error);
            return false;
        }
    };

    const updatePositions = async (newBanners: Banner[]) => {
        setBanners(newBanners);

        const updates = newBanners.map((banner, index) => ({
            id: banner.id,
            position: index + 1,
        }));

        setSaving(true);
        try {
            const res = await fetch('/api/banners', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates }),
            });

            if (!res.ok) {
                throw new Error('Failed to update positions');
            }

            await fetchBanners();
            return true;
        } catch (error) {
            console.error('Error updating positions:', error);
            await fetchBanners();
            return false;
        } finally {
            setSaving(false);
        }
    };

    return {
        banners,
        loading,
        saving,
        fetchBanners,
        deleteBanner,
        updatePositions,
    };
}
