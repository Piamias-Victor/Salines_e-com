'use client';

import { useState, useEffect } from 'react';
import { Menu, User, ShoppingCart, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/molecules/Logo';
import { SearchBar } from '@/components/molecules/SearchBar';
import { Drawer } from '@/components/molecules/Drawer';
import { categoriesService } from '@/lib/services';
import type { Category } from '@/lib/types';
import { useCart } from '@/hooks/useCart';

function CartButtonMobile() {
    const { cart, toggleCart } = useCart();
    const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <button
            onClick={toggleCart}
            className="w-10 h-10 flex items-center justify-center text-[#3f4c53] hover:text-[#fe0090] transition-colors relative"
            aria-label="Panier"
        >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#fe0090] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {itemCount}
                </span>
            )}
        </button>
    );
}

export function MobileNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await categoriesService.getMenu();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        }
        fetchCategories();
    }, []);

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setIsSubMenuOpen(true);
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsSubMenuOpen(false);
        setSelectedCategory(null);
    };

    return (
        <>
            {/* Mobile Navbar */}
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Hamburger Menu */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="w-10 h-10 flex items-center justify-center text-[#3f4c53] hover:text-[#fe0090] transition-colors"
                        aria-label="Menu"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <div className="flex-1 flex justify-center">
                        <Logo />
                    </div>

                    {/* User & Cart Icons */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/account"
                            className="w-10 h-10 flex items-center justify-center text-[#3f4c53] hover:text-[#fe0090] transition-colors"
                            aria-label="Mon compte"
                        >
                            <User size={22} />
                        </Link>
                        <CartButtonMobile />
                    </div>
                </div>

                {/* Search Bar - Mobile Only */}
                <div className="mt-3 pb-1">
                    <SearchBar />
                </div>
            </div>

            {/* Main Menu Drawer */}
            <Drawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                title="Menu"
            >
                {/* Search Bar */}
                {/* <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe0090] focus:border-transparent"
                        />
                    </div>
                </div> */}

                {/* Categories */}
                <div className="py-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                            <span className="font-medium text-[#3f4c53]">{category.name}</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>
                    ))}
                </div>
            </Drawer>

            {/* Sub Menu Drawer */}
            <Drawer
                isOpen={isSubMenuOpen}
                onClose={() => setIsSubMenuOpen(false)}
                title={selectedCategory?.name}
            >
                <div className="py-2">
                    {/* View All Link */}
                    <Link
                        href={`/category/${selectedCategory?.slug}`}
                        onClick={closeAllMenus}
                        className="block px-4 py-3 font-semibold text-[#fe0090] hover:bg-gray-50 transition-colors"
                    >
                        Voir tous les produits
                    </Link>

                    {/* Subcategories would go here */}
                    <div className="border-t border-gray-200 mt-2">
                        {selectedCategory?.children && selectedCategory.children.length > 0 ? (
                            selectedCategory.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/category/${child.slug}`}
                                    onClick={closeAllMenus}
                                    className="block px-4 py-3 text-[#3f4c53] hover:bg-gray-50 hover:text-[#fe0090] transition-colors border-b border-gray-50 last:border-0"
                                >
                                    {child.name}
                                </Link>
                            ))
                        ) : (
                            <p className="px-4 py-4 text-sm text-gray-500 italic">
                                Aucune sous-catégorie
                            </p>
                        )}
                    </div>
                </div>
            </Drawer>
        </>
    );
}
