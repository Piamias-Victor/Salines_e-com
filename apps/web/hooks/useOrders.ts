import { useState, useEffect } from 'react';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    guestEmail: string | null;
    items: any[];
    createdAt: string;
    stats: {
        totalItems: number;
        pendingItems: number;
        preparedItems: number;
    };
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface UseOrdersParams {
    statusFilter?: string;
    search?: string;
}

export function useOrders({ statusFilter = 'all', search = '' }: UseOrdersParams = {}) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (search) params.append('search', search);
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const response = await fetch(`/api/admin/orders?${params}`);
            const data = await response.json();

            setOrders(data.orders);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, statusFilter]);

    const goToPage = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
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

    const refresh = () => {
        fetchOrders();
    };

    return {
        orders,
        pagination,
        loading,
        fetchOrders,
        goToPage,
        nextPage,
        previousPage,
        refresh,
    };
}
