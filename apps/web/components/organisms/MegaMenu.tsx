'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { categoriesService } from '@/lib/services';

interface FeaturedLink {
    title: string;
    url: string;
    imageUrl: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    highlightColor: string | null;
    highlightTextColor: string | null;
    children: Category[];
    featuredLinks?: FeaturedLink[];
}

export function MegaMenu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoriesService.getMenu();
                setCategories(data);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        loadCategories();
    }, []);

    const handleMouseEnter = (categoryId: string) => {
        // Annuler tout timeout de fermeture en cours
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setActiveCategory(categoryId);
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        // Délai plus long pour plus de confort
        closeTimeoutRef.current = setTimeout(() => {
            setIsMenuOpen(false);
            setActiveCategory(null);
        }, 300);
    };

    const handleDropdownEnter = () => {
        // Annuler la fermeture si on entre dans le dropdown
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    if (categories.length === 0) return null;

    return (
        <div
            ref={menuRef}
            className="bg-white border-b border-gray-100 relative z-40 hidden md:block"
            onMouseLeave={handleMouseLeave}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex items-center gap-4 py-2">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(category.id)}
                        >
                            <Link
                                href={`/category/${category.slug}`}
                                className={`block px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-lg transition-colors ${category.highlightColor
                                    ? 'hover:opacity-90'
                                    : 'text-gray-900 hover:bg-gray-50'
                                    } flex items-center justify-between gap-1 group`}
                                style={category.highlightColor ? {
                                    backgroundColor: category.highlightColor,
                                    color: category.highlightTextColor || '#ffffff'
                                } : undefined}
                            >
                                {category.name}
                                {category.children?.length > 0 && <ChevronDown size={12} />}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mega Menu Dropdown - Outside of li loop */}
            {isMenuOpen && activeCategory && (
                <div
                    className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-100"
                    onMouseEnter={handleDropdownEnter}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {categories.filter(cat => cat.id === activeCategory).map((category) => (
                            <div key={category.id} className="flex gap-12">
                                {/* Left Column: Subcategories List */}
                                <div className="w-1/4 border-r border-gray-100 pr-8">
                                    <h3 className="text-[#fe0090] font-bold text-lg mb-4 uppercase tracking-wider">
                                        Tout {category.name}
                                    </h3>
                                    <ul className="space-y-3">
                                        {category.children?.map((child) => (
                                            <li key={child.id}>
                                                <Link
                                                    href={`/category/${child.slug}`}
                                                    className="text-[#3f4c53] hover:text-[#fe0090] hover:translate-x-1 transition-all block text-base font-medium"
                                                >
                                                    {child.name}
                                                </Link>
                                            </li>
                                        ))}
                                        <li>
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="text-gray-400 hover:text-[#fe0090] text-sm mt-4 block font-medium flex items-center gap-1"
                                            >
                                                Voir tout <ChevronRight size={14} />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Right Column: Featured Cards Grid */}
                                <div className="flex-1">
                                    <h3 className="text-[#3f4c53] font-bold text-lg mb-6">
                                        À la une
                                    </h3>
                                    <div className="grid grid-cols-3 gap-6">
                                        {/* Featured Links from JSON */}
                                        {category.featuredLinks?.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className="group relative h-48 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                                            >
                                                <Image
                                                    src={link.imageUrl}
                                                    alt={link.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                                                    <span className="text-white font-bold text-lg group-hover:text-[#fef000] transition-colors">
                                                        {link.title}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}

                                        {/* Fallback Featured Image if no links */}
                                        {(!category.featuredLinks || category.featuredLinks.length === 0) && category.imageUrl && (
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="col-span-2 group relative h-48 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                                            >
                                                <Image
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                                    <span className="text-white font-bold text-xl">
                                                        Découvrir {category.name}
                                                    </span>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }
        </div >
    );
}
