import Image from 'next/image';

interface Category {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
}

interface CategoryHeaderProps {
    category: Category;
    productCount: number;
}

export function CategoryHeader({ category, productCount }: CategoryHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-8">
                    {/* Category Image */}
                    {category.imageUrl && (
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 bg-white border-4 border-white">
                            <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Category Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="text-lg text-gray-600 mb-4 max-w-3xl leading-relaxed">
                                {category.description.split('\n')[0]}
                            </p>
                        )}
                        <div className="flex items-center gap-4">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#FE0090]/10 text-[#FE0090] text-sm font-semibold">
                                {productCount} produits disponibles
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
