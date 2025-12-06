'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, ChevronRight, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
    id: string;
    quantity: number;
    price: string;
    product: {
        name: string;
        imageUrl: string | null;
        slug: string;
    };
}

interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    total: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const { user, isLoading: authLoading, accessToken } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !accessToken) return;

            try {
                const response = await fetch('/api/user/orders', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des commandes');
                }

                const data = await response.json();
                setOrders(data.orders);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        if (user && accessToken) {
            fetchOrders();
        }
    }, [user, accessToken]);

    if (authLoading || (loading && !error)) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#fe0090]" />
            </div>
        );
    }

    if (!user) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
            case 'PROCESSING':
            case 'PREPARING':
                return 'bg-blue-100 text-blue-800';
            case 'SHIPPED':
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
            case 'REFUNDED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'En attente';
            case 'CONFIRMED':
                return 'Confirmée';
            case 'PROCESSING':
            case 'PREPARING':
                return 'En préparation';
            case 'SHIPPED':
                return 'Expédiée';
            case 'DELIVERED':
                return 'Livrée';
            case 'CANCELLED':
                return 'Annulée';
            case 'REFUNDED':
                return 'Remboursée';
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/account"
                        className="text-gray-500 hover:text-[#fe0090] transition-colors mb-4 inline-flex items-center gap-2"
                    >
                        <ChevronRight className="rotate-180" size={16} />
                        Retour à mon compte
                    </Link>
                    <h1 className="text-3xl font-bold text-[#3f4c53] flex items-center gap-3">
                        <Package className="text-[#fe0090]" />
                        Mes commandes
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Aucune commande pour le moment
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Vous n'avez pas encore passé de commande. Découvrez nos produits et commencez votre shopping !
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#fe0090] hover:bg-[#fe0090]/90 transition-colors"
                        >
                            Commencer mes achats
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-wrap gap-4 md:gap-8">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                    Commande n°
                                                </p>
                                                <p className="font-bold text-[#3f4c53]">
                                                    {order.orderNumber}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                    Date
                                                </p>
                                                <div className="flex items-center gap-2 font-medium text-gray-700">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                    Total
                                                </p>
                                                <p className="font-bold text-[#fe0090]">
                                                    {Number(order.total).toLocaleString('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'EUR',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {item.product.imageUrl ? (
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Package size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 truncate">
                                                        {item.product.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        Quantité : {item.quantity} ×{' '}
                                                        {Number(item.price).toLocaleString('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'EUR',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
