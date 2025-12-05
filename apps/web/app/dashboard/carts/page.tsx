'use client';

import { useState } from 'react';
import { ShoppingCart, User, Clock, Search } from 'lucide-react';
import { useCarts } from '@/hooks/useCarts';
import { CartsTable } from '@/components/dashboard/carts/CartsTable';

export default function CartsPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'user' | 'guest'>('all');
    const { carts, pagination, loading, fetchCarts, nextPage, previousPage } = useCarts({ search, typeFilter });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCarts();
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">
                    Gestion des Paniers
                </h1>
                <p className="text-gray-600">
                    Visualisez et gérez tous les paniers stockés en base de données
                </p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par email ou session..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe0090] focus:border-transparent"
                            />
                        </div>
                    </form>

                    <div className="flex gap-2">
                        {(['all', 'user', 'guest'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTypeFilter(filter)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${typeFilter === filter
                                        ? 'bg-[#fe0090] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {filter === 'all' ? 'Tous' : filter === 'user' ? 'Utilisateurs' : 'Invités'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Paniers</p>
                            <p className="text-2xl font-bold text-[#3f4c53]">{pagination.total}</p>
                        </div>
                        <ShoppingCart className="text-blue-500" size={32} />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Utilisateurs</p>
                            <p className="text-2xl font-bold text-[#3f4c53]">
                                {carts.filter(c => c.userId).length}
                            </p>
                        </div>
                        <User className="text-green-500" size={32} />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Invités</p>
                            <p className="text-2xl font-bold text-[#3f4c53]">
                                {carts.filter(c => !c.userId).length}
                            </p>
                        </div>
                        <Clock className="text-orange-500" size={32} />
                    </div>
                </div>
            </div>

            {/* Carts Table */}
            <CartsTable
                carts={carts}
                loading={loading}
                pagination={pagination}
                onNextPage={nextPage}
                onPreviousPage={previousPage}
            />
        </div>
    );
}
