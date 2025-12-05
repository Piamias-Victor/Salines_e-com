'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, Package, Truck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { OrderItemsTable } from '@/components/dashboard/orders/OrderItemsTable';
import { OrderPaymentInfo } from '@/components/dashboard/orders/OrderPaymentInfo';
import { OrderSidebar } from '@/components/dashboard/orders/OrderSidebar';
import { printDeliveryNote } from '@/utils/deliveryNoteUtils';

const STATUS_CONFIG: Record<string, { label: string; variant: 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'error' }> = {
    PENDING: { label: 'En attente', variant: 'neutral' },
    CONFIRMED: { label: 'Confirmée', variant: 'info' },
    PROCESSING: { label: 'En préparation', variant: 'warning' },
    SHIPPED: { label: 'Expédiée', variant: 'primary' },
    DELIVERED: { label: 'Livrée', variant: 'success' },
    CANCELLED: { label: 'Annulée', variant: 'error' },
};

export default function OrderDetailsPage() {
    const params = useParams();
    const { order, loading, updating, updateStatus } = useOrderDetails(params.id as string);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe0090]"></div>
            </div>
        );
    }

    if (!order) return null;

    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#fe0090] transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Retour aux commandes</span>
                </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-[#3f4c53]">
                            Commande {order.orderNumber}
                        </h1>
                        <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                        </Badge>
                    </div>
                    <p className="text-gray-600 flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(order.createdAt).toLocaleString('fr-FR')}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => printDeliveryNote(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Printer size={18} />
                        Bon de livraison
                    </button>

                    {order.status === 'CONFIRMED' && (
                        <button
                            onClick={() => updateStatus('PROCESSING')}
                            disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                            <Package size={18} />
                            Commencer préparation
                        </button>
                    )}

                    {order.status === 'PROCESSING' && (
                        <button
                            onClick={() => updateStatus('SHIPPED')}
                            disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                        >
                            <Truck size={18} />
                            Marquer expédiée
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <OrderItemsTable items={order.items} />
                    <OrderPaymentInfo
                        paymentStatus={order.paymentStatus}
                        paymentMethod={order.paymentMethod}
                        subtotal={order.subtotal}
                        shippingCost={order.shippingCost}
                        total={order.total}
                    />
                </div>

                {/* Sidebar */}
                <OrderSidebar
                    user={order.user}
                    guestEmail={order.guestEmail}
                    shippingAddress={order.shippingAddress}
                />
            </div>
        </div>
    );
}
