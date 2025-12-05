import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
    sortable?: boolean;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onSort?: (key: string) => void;
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    pagination?: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    emptyMessage?: string;
}

export function Table<T>({
    data,
    columns,
    onSort,
    sortKey,
    sortDirection,
    pagination,
    emptyMessage = 'Aucune donnée disponible'
}: TableProps<T>) {
    const handleSort = (key: string, sortable?: boolean) => {
        if (sortable && onSort) {
            onSort(key);
        }
    };

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => handleSort(column.key, column.sortable)}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.header}
                                        {column.sortable && sortKey === column.key && (
                                            <span className="text-[#fe0090]">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                                            {column.render(item)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4">
                    <p className="text-sm text-gray-700">
                        Page {pagination.page} sur {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
