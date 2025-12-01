'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '../molecules/Logo';
import { SearchBar } from '../molecules/SearchBar';
import { CartButton } from '../molecules/CartButton';
import { UserButton } from '../molecules/UserButton';

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Search Bar - Center (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <SearchBar />
                    </div>

                    {/* Icons - Right (Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <CartButton />
                        <UserButton />
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2 md:hidden">
                        <CartButton />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-4">
                        <SearchBar />
                        <div className="flex items-center gap-2 pt-2">
                            <UserButton />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
