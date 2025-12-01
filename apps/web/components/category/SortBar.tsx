'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

interface SortBarProps {
    totalProducts: number;
    currentSort: string;
}

const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'newest', label: 'Nouveautés' },
];

export function SortBar({ totalProducts, currentSort }: SortBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value === 'relevance') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between mb-6">
            {/* Product Count */}
            <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{totalProducts}</span> produit{totalProducts > 1 ? 's' : ''}
            </p>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FE0090] focus:border-[#FE0090]"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
