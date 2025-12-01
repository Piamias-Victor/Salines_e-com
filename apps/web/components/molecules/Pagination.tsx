'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }
        return `${baseUrl}?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5;

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <nav className="flex items-center justify-center gap-1 mt-12">
            {/* Previous Button */}
            <Link
                href={createPageUrl(currentPage - 1)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                        <Link
                            key={index}
                            href={createPageUrl(page)}
                            className={`min-w-[36px] h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page
                                    ? 'bg-[#FE0090] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </Link>
                    ) : (
                        <span key={index} className="min-w-[36px] h-9 flex items-center justify-center text-gray-400 text-sm">
                            {page}
                        </span>
                    )
                ))}
            </div>

            {/* Next Button */}
            <Link
                href={createPageUrl(currentPage + 1)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
            >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4" />
            </Link>
        </nav>
    );
}
