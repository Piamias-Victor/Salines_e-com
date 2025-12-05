'use client';

interface Category {
    id: string;
    name: string;
}

interface Brand {
    id: string;
    name: string;
}

interface ProductCategoriesProps {
    categories: Category[];
    brands: Brand[];
    selectedCategoryIds: string[];
    selectedBrandIds: string[];
    onToggleCategory: (id: string) => void;
    onToggleBrand: (id: string) => void;
}

export function ProductCategories({
    categories,
    brands,
    selectedCategoryIds,
    selectedBrandIds,
    onToggleCategory,
    onToggleBrand
}: ProductCategoriesProps) {
    return (
        <>
            {/* Categories Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map((cat) => {
                        const isSelected = selectedCategoryIds.includes(cat.id);
                        return (
                            <label
                                key={cat.id}
                                className={`flex items-center justify-center text-center p-2 rounded-lg cursor-pointer transition-all border text-xs font-medium ${isSelected
                                        ? 'bg-pink-50 border-[#fe0090] text-[#fe0090]'
                                        : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onToggleCategory(cat.id)}
                                    className="hidden"
                                />
                                {cat.name}
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Brands Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Marque</h3>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {brands.map((brand) => {
                        const isSelected = selectedBrandIds.includes(brand.id);
                        return (
                            <label
                                key={brand.id}
                                className={`flex items-center justify-center text-center p-2 rounded-lg cursor-pointer transition-all border text-xs font-medium ${isSelected
                                        ? 'bg-pink-50 border-[#fe0090] text-[#fe0090]'
                                        : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onToggleBrand(brand.id)}
                                    className="hidden"
                                />
                                {brand.name}
                            </label>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
