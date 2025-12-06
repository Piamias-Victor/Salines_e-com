'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    createdAt: string;
    paymentStatus: string;
}

interface Address {
    id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

interface UserDetail {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    createdAt: string;
    role: string;
    addresses: Address[];
    orders: Order[];
    _count: {
        orders: number;
    };
}

export default function UserDetailPage() {
    const params = useParams();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/admin/users/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-[#fe0090]" size={48} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900">Client introuvable</h2>
                <Link href="/dashboard/users" className="text-[#fe0090] hover:underline mt-2 inline-block">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/users" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Client depuis le {format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Addresses */}
                <div className="space-y-8">
                    {/* Contact Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <UserIcon className="text-[#fe0090]" size={20} />
                            Informations
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail size={18} />
                                <a href={`mailto:${user.email}`} className="hover:text-[#fe0090] transition-colors">
                                    {user.email}
                                </a>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={18} />
                                    <a href={`tel:${user.phone}`} className="hover:text-[#fe0090] transition-colors">
                                        {user.phone}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-gray-600">
                                <ShoppingBag size={18} />
                                <span>{user._count.orders} commandes passées</span>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-[#fe0090]" size={20} />
                            Adresses ({user.addresses.length})
                        </h2>
                        <div className="space-y-4">
                            {user.addresses.map((address) => (
                                <div key={address.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">
                                            {address.firstName} {address.lastName}
                                        </span>
                                        {address.isDefault && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                                                Défaut
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {address.addressLine1}<br />
                                        {address.postalCode} {address.city}<br />
                                        {address.country}
                                    </p>
                                </div>
                            ))}
                            {user.addresses.length === 0 && (
                                <p className="text-sm text-gray-500 italic">Aucune adresse enregistrée</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Orders */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Package className="text-[#fe0090]" size={20} />
                            Dernières commandes
                        </h2>

                        <div className="space-y-4">
                            {user.orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#fe0090]/30 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={14} />
                                            {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatPrice(Number(order.total))}</p>
                                        <p className={`text-xs font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'
                                            }`}>
                                            {order.paymentStatus === 'PAID' ? 'Payée' : 'En attente'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {user.orders.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Aucune commande passée
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserIcon({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
