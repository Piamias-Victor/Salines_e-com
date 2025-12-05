'use client';

import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui';

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

interface OrdersTableProps {
    orders: Order[];
    loading: boolean;
    selectedOrders: Set<string>;
    onToggleSelect: (orderId: string) => void;
    onToggleSelectAll: () => void;
    pagination?: Pagination;
    onNextPage?: () => void;
    onPreviousPage?: () => void;
}

const STATUS_BADGES: Record<string, { label: string; variant: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info' }> = {
    PENDING: { label: 'En attente', variant: 'neutral' },
    CONFIRMED: { label: 'Confirmée', variant: 'info' },
    PROCESSING: { label: 'En préparation', variant: 'warning' },
    SHIPPED: { label: 'Expédiée', variant: 'info' },
    DELIVERED: { label: 'Livrée', variant: 'success' },
    CANCELLED: { label: 'Annulée', variant: 'error' },
    REFUNDED: { label: 'Remboursée', variant: 'warning' },
};

export function OrdersTable({
    orders,
    loading,
    selectedOrders,
    onToggleSelect,
    onToggleSelectAll,
    pagination,
    onNextPage,
    onPreviousPage
}: OrdersTableProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const badge = STATUS_BADGES[status] || STATUS_BADGES.PENDING;
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe0090] mx-auto"></div>
                    <p className="text-gray-600 mt-4">Chargement...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-12 text-center">
                    <Package className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Aucune commande trouvée</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.size === orders.length && orders.length > 0}
                                    onChange={onToggleSelectAll}
                                    className="rounded border-gray-300"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                N° Commande
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Articles
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.has(order.id)}
                                        onChange={() => onToggleSelect(order.id)}
                                        className="rounded border-gray-300"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-mono text-sm font-medium text-gray-900">
                                        {order.orderNumber}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {order.user ? (
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {order.user.firstName} {order.user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{order.user.email}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">{order.guestEmail}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.stats.totalItems}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {Number(order.total).toFixed(2)} €
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        className="inline-flex items-center gap-1 text-[#fe0090] hover:text-[#d4007a] font-medium"
                                    >
                                        Détails
                                        <ChevronRight size={16} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Page {pagination.page} sur {pagination.totalPages} ({pagination.total} commandes)
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={onPreviousPage}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>
                        <button
                            onClick={onNextPage}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
