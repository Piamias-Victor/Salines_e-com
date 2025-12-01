import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
    product: any;
}

export function Breadcrumb({ product }: BreadcrumbProps) {
    const getCategoryPath = (category: any): any[] => {
        const path = [];
        let current = category;

        while (current) {
            path.unshift(current);
            current = current.parents && current.parents.length > 0 ? current.parents[0] : null;
        }

        return path;
    };

    const mainCategory = product.categories[0]?.category;
    const categoryPath = mainCategory ? getCategoryPath(mainCategory) : [];
    const brand = product.brands[0]?.brand;

    return (
        <nav className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-8 px-4 md:px-0">
            <Link href="/" className="hover:text-[#fe0090] transition-colors whitespace-nowrap">
                Accueil
            </Link>

            {categoryPath.map((cat: any) => (
                <div key={cat.id} className="flex items-center gap-2 whitespace-nowrap">
                    <ChevronRight size={14} className="text-gray-400" />
                    <Link
                        href={`/category/${cat.slug}`}
                        className="hover:text-[#fe0090] transition-colors"
                    >
                        {cat.name}
                    </Link>
                </div>
            ))}

            {brand && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <ChevronRight size={14} className="text-gray-400" />
                    <Link
                        href={`/brand/${brand.slug}`}
                        className="hover:text-[#fe0090] transition-colors font-medium text-gray-900"
                    >
                        {brand.name}
                    </Link>
                </div>
            )}
        </nav>
    );
}
