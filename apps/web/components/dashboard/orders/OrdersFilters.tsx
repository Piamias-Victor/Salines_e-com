'use client';

import { Search } from 'lucide-react';

interface OrdersFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
}

const STATUS_TABS = [
    { value: 'all', label: 'Toutes' },
    { value: 'CONFIRMED', label: 'À préparer' },
    { value: 'PROCESSING', label: 'En préparation' },
    { value: 'SHIPPED', label: 'Expédiées' },
    { value: 'DELIVERED', label: 'Livrées' },
];

export function OrdersFilters({
    search,
    onSearchChange,
    onSearchSubmit,
    statusFilter,
    onStatusFilterChange
}: OrdersFiltersProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearchSubmit();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <form onSubmit={handleSubmit} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Rechercher par numéro, client..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe0090] focus:border-transparent"
                        />
                    </div>
                </form>
            </div>

            <div className="flex gap-2 overflow-x-auto">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onStatusFilterChange(tab.value)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${statusFilter === tab.value
                                ? 'bg-[#fe0090] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
