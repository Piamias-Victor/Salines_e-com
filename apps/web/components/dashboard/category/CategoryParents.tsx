'use client';

interface Category {
    id: string;
    name: string;
}

interface CategoryParentsProps {
    categories: Category[];
    selectedParentIds: string[];
    currentCategoryId?: string;
    onToggle: (id: string) => void;
}

export function CategoryParents({ categories, selectedParentIds, currentCategoryId, onToggle }: CategoryParentsProps) {
    const availableCategories = categories.filter(c => c.id !== currentCategoryId);

    return (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {availableCategories.map((cat) => {
                const isSelected = selectedParentIds.includes(cat.id);
                return (
                    <label
                        key={cat.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border text-sm ${isSelected
                                ? 'bg-pink-50 border-[#fe0090] text-[#fe0090]'
                                : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <span>{cat.name}</span>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggle(cat.id)}
                            className="hidden"
                        />
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#fe0090]" />}
                    </label>
                );
            })}
            {availableCategories.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4">Aucune autre catégorie disponible</p>
            )}
        </div>
    );
}
