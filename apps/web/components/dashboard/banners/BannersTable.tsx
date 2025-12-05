'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, GripVertical, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    position: number;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
}

interface BannersTableProps {
    banners: Banner[];
    loading: boolean;
    saving: boolean;
    onDelete: (id: string) => void;
    onReorder: (banners: Banner[]) => void;
}

function SortableBannerRow({ banner, onDelete }: { banner: Banner; onDelete: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isActiveDate = () => {
        const now = new Date();
        if (banner.startDate && new Date(banner.startDate) > now) return false;
        if (banner.endDate && new Date(banner.endDate) < now) return false;
        return true;
    };

    return (
        <div ref={setNodeRef} style={style} className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
                <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
                    <GripVertical size={20} />
                </button>

                <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                </div>

                <div>
                    <h3 className="font-medium text-gray-900">{banner.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        {(banner.startDate || banner.endDate) && (
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>
                                    {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : '...'}
                                    {' -> '}
                                    {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : '...'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                    <Badge variant={banner.isActive ? 'success' : 'neutral'}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {!isActiveDate() && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            Hors période
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/banners/${banner.id}`} className="p-2 text-gray-400 hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                    </Link>
                    <button onClick={() => onDelete(banner.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function BannersTable({ banners, loading, saving, onDelete, onReorder }: BannersTableProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = banners.findIndex((banner) => banner.id === active.id);
        const newIndex = banners.findIndex((banner) => banner.id === over.id);
        const newBanners = arrayMove(banners, oldIndex, newIndex);

        onReorder(newBanners);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 text-center text-gray-500">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
                {banners.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Aucune bannière trouvée</div>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={banners.map((banner) => banner.id)} strategy={verticalListSortingStrategy}>
                            {banners.map((banner) => (
                                <SortableBannerRow key={banner.id} banner={banner} onDelete={onDelete} />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {saving && (
                <div className="p-2 bg-blue-50 text-blue-700 text-sm text-center border-t border-blue-100">
                    Enregistrement...
                </div>
            )}
        </div>
    );
}
