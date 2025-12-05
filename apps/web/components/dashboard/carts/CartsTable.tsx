'use client';

import Link from 'next/link';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui';

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
    updatedAt: string;
}

interface Pagination {
    total: number;
    page: number;
    totalPages: number;
}

interface CartsTableProps {
    carts: Cart[];
    loading: boolean;
    pagination: Pagination;
    onNextPage: () => void;
    onPreviousPage: () => void;
}

const getCartStatus = (updatedAt: string) => {
    const hoursSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60);

    if (hoursSinceUpdate < 1) return { label: 'Actif', variant: 'success' as const };
    if (hoursSinceUpdate < 24) return { label: 'Récent', variant: 'warning' as const };
    return { label: 'Abandonné', variant: 'error' as const };
};

const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return d.toLocaleDateString('fr-FR');
};

export function CartsTable({ carts, loading, pagination, onNextPage, onPreviousPage }: CartsTableProps) {
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

    if (carts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-12 text-center">
                    <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Aucun panier trouvé</p>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Utilisateur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Articles
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                MAJ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {carts.map((cart) => {
                            const status = getCartStatus(cart.updatedAt);
                            return (
                                <tr key={cart.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                        {cart.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={cart.userId ? 'info' : 'neutral'}>
                                            {cart.userId ? 'Utilisateur' : 'Invité'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {cart.user ? (
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {cart.user.firstName} {cart.user.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">{cart.user.email}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 font-mono">
                                                {cart.sessionToken.substring(0, 12)}...
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cart.itemCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cart.total.toFixed(2)} €
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={status.variant}>
                                            {status.label}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(cart.updatedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link
                                            href={`/dashboard/carts/${cart.id}`}
                                            className="inline-flex items-center gap-1 text-[#fe0090] hover:text-[#d4007a] font-medium"
                                        >
                                            Détails
                                            <ChevronRight size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Page {pagination.page} sur {pagination.totalPages} ({pagination.total} paniers)
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
