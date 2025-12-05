'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Package, Clock } from 'lucide-react';
import { useCartDetails } from '@/hooks/useCartDetails';
import { CartItemsTable } from '@/components/dashboard/carts/CartItemsTable';
import { CartUserInfo } from '@/components/dashboard/carts/CartUserInfo';

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function CartDetailPage() {
    const params = useParams();
    const { cart, loading } = useCartDetails(params.id as string);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe0090]"></div>
            </div>
        );
    }

    if (!cart) return null;

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href="/dashboard/carts"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#fe0090] transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Retour aux paniers</span>
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">
                    Détails du Panier
                </h1>
                <p className="text-gray-600 font-mono text-sm">ID: {cart.id}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Articles</p>
                        <ShoppingCart className="text-blue-500" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-[#3f4c53]">{cart.stats.itemCount}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Total</p>
                        <Package className="text-green-500" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-[#3f4c53]">{cart.stats.subtotal.toFixed(2)} €</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Créé le</p>
                        <Clock className="text-purple-500" size={24} />
                    </div>
                    <p className="text-sm font-medium text-[#3f4c53]">{formatDate(cart.createdAt)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Dernière MAJ</p>
                        <Clock className="text-orange-500" size={24} />
                    </div>
                    <p className="text-sm font-medium text-[#3f4c53]">{formatDate(cart.updatedAt)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info */}
                <div className="lg:col-span-1">
                    <CartUserInfo
                        user={cart.user}
                        sessionToken={cart.sessionToken}
                        shippingMethod={cart.shippingMethod}
                    />
                </div>

                {/* Products */}
                <div className="lg:col-span-2">
                    <CartItemsTable items={cart.items} subtotal={cart.stats.subtotal} />
                </div>
            </div>
        </div>
    );
}
