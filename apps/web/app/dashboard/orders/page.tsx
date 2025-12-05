'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrdersFilters } from '@/components/dashboard/orders/OrdersFilters';
import { OrdersActionsBar } from '@/components/dashboard/orders/OrdersActionsBar';
import { OrdersTable } from '@/components/dashboard/orders/OrdersTable';
import { printPreparationSheet, printDeliveryNotes } from '@/utils/orderPrintUtils';

export default function OrdersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

    const { orders, pagination, loading, fetchOrders, nextPage, previousPage } = useOrders({
        statusFilter,
        search,
    });

    const handleSearch = () => {
        fetchOrders();
    };

    const toggleSelectOrder = (orderId: string) => {
        const newSelected = new Set(selectedOrders);
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId);
        } else {
            newSelected.add(orderId);
        }
        setSelectedOrders(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedOrders.size === orders.length) {
            setSelectedOrders(new Set());
        } else {
            setSelectedOrders(new Set(orders.map(o => o.id)));
        }
    };

    const handleGeneratePreparationSheet = async () => {
        if (selectedOrders.size === 0) return;
        try {
            await printPreparationSheet(Array.from(selectedOrders));
        } catch (error) {
            console.error('Error generating preparation sheet:', error);
        }
    };

    const handleGenerateDeliveryNotes = () => {
        if (selectedOrders.size === 0) return;
        const selectedOrdersList = orders.filter(o => selectedOrders.has(o.id));
        printDeliveryNotes(selectedOrdersList);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">
                    Gestion des Commandes
                </h1>
                <p className="text-gray-600">
                    Préparez et gérez vos commandes
                </p>
            </div>

            {/* Filters */}
            <OrdersFilters
                search={search}
                onSearchChange={setSearch}
                onSearchSubmit={handleSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {/* Selection Actions */}
            <OrdersActionsBar
                selectedCount={selectedOrders.size}
                onGeneratePreparationSheet={handleGeneratePreparationSheet}
                onGenerateDeliveryNotes={handleGenerateDeliveryNotes}
            />

            {/* Orders Table */}
            <OrdersTable
                orders={orders}
                loading={loading}
                selectedOrders={selectedOrders}
                onToggleSelect={toggleSelectOrder}
                onToggleSelectAll={toggleSelectAll}
                pagination={pagination}
                onNextPage={nextPage}
                onPreviousPage={previousPage}
            />
        </div>
    );
}
