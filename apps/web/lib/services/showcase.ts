import type { Tab, ShowcaseSubTab, SearchSubTab, ShowcaseItem } from '@/lib/types/showcase';
import { toast } from 'sonner';

interface SaveShowcaseOrderParams {
    activeTab: Tab;
    showcaseSubTab: ShowcaseSubTab;
    searchSubTab: SearchSubTab;
    items: ShowcaseItem[];
}

export async function saveShowcaseOrder({
    activeTab,
    showcaseSubTab,
    searchSubTab,
    items,
}: SaveShowcaseOrderParams): Promise<boolean> {
    try {
        let endpoint = '';
        let positionField = '';

        if (activeTab === 'mega-menu') {
            endpoint = '/api/categories';
            positionField = 'menuPosition';
        } else if (activeTab === 'showcase') {
            if (showcaseSubTab === 'univers') {
                endpoint = '/api/categories';
                positionField = 'position';
            } else if (showcaseSubTab === 'brands') {
                endpoint = '/api/brands';
                positionField = 'position';
            } else if (showcaseSubTab === 'products') {
                endpoint = '/api/featured-products';
                positionField = 'position';
            }
        } else if (activeTab === 'search') {
            if (searchSubTab === 'categories') {
                endpoint = '/api/categories/search';
                positionField = 'searchPosition';
            } else if (searchSubTab === 'brands') {
                endpoint = '/api/brands/search';
                positionField = 'searchPosition';
            }
        }

        if (!endpoint) {
            throw new Error('Invalid tab configuration');
        }

        const updates = items.map(item => ({
            id: item.id,
            [positionField]: (item as any)[positionField],
        }));

        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updates }),
        });

        if (!response.ok) {
            throw new Error('Failed to save');
        }

        toast.success('Ordre sauvegardé avec succès !');
        return true;
    } catch (error) {
        console.error('Error saving showcase order:', error);
        toast.error('Erreur lors de la sauvegarde');
        return false;
    }
}
