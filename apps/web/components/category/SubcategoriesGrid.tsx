import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
}

interface SubcategoriesGridProps {
    subcategories: Subcategory[];
}

export function SubcategoriesGrid({ subcategories }: SubcategoriesGridProps) {
    if (!subcategories || subcategories.length === 0) return null;

    return (
        <div className="bg-gray-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Catégories
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {subcategories.map((subcategory) => (
                        <Link
                            key={subcategory.id}
                            href={`/category/${subcategory.slug}`}
                            className="group bg-white rounded-lg p-3 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-[#FE0090]"
                        >
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {subcategory.imageUrl ? (
                                        <Image
                                            src={subcategory.imageUrl}
                                            alt={subcategory.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                                <span className="text-xs font-medium text-gray-700 group-hover:text-[#FE0090] transition-colors line-clamp-2">
                                    {subcategory.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
