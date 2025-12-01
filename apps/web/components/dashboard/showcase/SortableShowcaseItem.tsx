import Image from 'next/image';
import { GripVertical, Eye, EyeOff, ImageIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ShowcaseItem } from '@/lib/types/showcase';

interface SortableItemProps {
    id: string;
    item: ShowcaseItem;
    positionField: keyof ShowcaseItem;
    onToggleVisibility?: (id: string) => void;
    renderContent: (item: ShowcaseItem) => React.ReactNode;
}

export function SortableShowcaseItem({
    id,
    item,
    positionField,
    onToggleVisibility,
    renderContent
}: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const position = (item as any)[positionField];
    const isVisible = position > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
                <GripVertical size={20} />
            </div>

            <div className="flex-1 min-w-0">
                {renderContent(item)}
            </div>

            {onToggleVisibility && (
                <button
                    onClick={() => onToggleVisibility(id)}
                    className={`p-2 rounded-lg transition-colors ${isVisible
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                    title={isVisible ? 'Masquer' : 'Afficher'}
                >
                    {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
            )}
        </div>
    );
}
