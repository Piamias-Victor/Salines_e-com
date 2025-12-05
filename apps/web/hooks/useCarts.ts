import { useState, useEffect } from 'react';

interface Cart {
    id: string;
    userId: string | null;
    sessionToken: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    itemCount: number;
    total: number;
    shippingMethod: {
        name: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface UseCartsParams {
    search?: string;
    typeFilter?: 'all' | 'user' | 'guest';
}

export function useCarts({ search = '', typeFilter = 'all' }: UseCartsParams = {}) {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchCarts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (search) params.append('search', search);
            if (typeFilter !== 'all') params.append('type', typeFilter);

            const response = await fetch(`/api/admin/carts?${params}`);
            const data = await response.json();

            setCarts(data.carts);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching carts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, [pagination.page, typeFilter]);

    const goToPage = (page: number) => {
        setPagination({ ...pagination, page });
    };

    const nextPage = () => {
        if (pagination.page < pagination.totalPages) {
            goToPage(pagination.page + 1);
        }
    };

    const previousPage = () => {
        if (pagination.page > 1) {
            goToPage(pagination.page - 1);
        }
    };

    return {
        carts,
        pagination,
        loading,
        fetchCarts,
        goToPage,
        nextPage,
        previousPage,
    };
}
