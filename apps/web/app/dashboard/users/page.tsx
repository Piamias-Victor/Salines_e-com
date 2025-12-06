'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, User, Mail, Calendar, ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    _count: {
        orders: number;
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search,
            });
            const res = await fetch(`/api/admin/users?${params}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(data.pagination.pages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, page]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-500">Gérez vos clients et consultez leur historique</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher un client (nom, email)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscription</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Commandes</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin mx-auto text-[#fe0090]" size={32} />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Aucun client trouvé
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#fe0090] font-bold">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        {user.role === 'ADMIN' && (
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold">ADMIN</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail size={16} />
                                                <span className="text-sm">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={16} />
                                                <span className="text-sm">
                                                    {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                                <ShoppingBag size={14} />
                                                {user._count.orders}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link
                                                href={`/dashboard/users/${user.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#fe0090] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                                            >
                                                <Eye size={16} />
                                                Voir
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {page} sur {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
