'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, GripVertical, ImageIcon, Calendar } from 'lucide-react';
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

function SortableBannerRow({ banner, onDelete }: { banner: Banner; onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: banner.id });

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
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                >
                    <GripVertical size={20} />
                </button>

                <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                    />
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${banner.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {!isActiveDate() && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            Hors période
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={`/dashboard/banners/${banner.id}`}
                        className="p-2 text-gray-400 hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-colors"
                    >
                        <Edit2 size={18} />
                    </Link>
                    <button
                        onClick={() => onDelete(banner.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/banners');
            const data = await res.json();
            setBanners(data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) return;

        try {
            const res = await fetch(`/api/banners/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchBanners();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting banner:', error);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = banners.findIndex((banner) => banner.id === active.id);
        const newIndex = banners.findIndex((banner) => banner.id === over.id);

        const newBanners = arrayMove(banners, oldIndex, newIndex);

        // Update local state immediately for smooth UX
        setBanners(newBanners);

        // Prepare updates with new positions
        const updates = newBanners.map((banner, index) => ({
            id: banner.id,
            position: index + 1,
        }));

        // Save to backend
        setSaving(true);
        try {
            const res = await fetch('/api/banners', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates }),
            });

            if (!res.ok) {
                throw new Error('Failed to update positions');
            }

            // Refresh to get the latest data
            await fetchBanners();
        } catch (error) {
            console.error('Error updating positions:', error);
            alert('Erreur lors de la mise à jour des positions');
            // Revert on error
            await fetchBanners();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bannières</h1>
                    <p className="text-sm text-gray-500">Gérez les bannières de la page d'accueil</p>
                </div>
                <Link
                    href="/dashboard/banners/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#fe0090]/90 transition-colors shadow-lg shadow-pink-500/20"
                >
                    <Plus size={20} />
                    Nouvelle bannière
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Banners List */}
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Chargement...</div>
                    ) : banners.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Aucune bannière trouvée</div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={banners.map((banner) => banner.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {banners.map((banner) => (
                                    <SortableBannerRow key={banner.id} banner={banner} onDelete={handleDelete} />
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
        </div>
    );
}
