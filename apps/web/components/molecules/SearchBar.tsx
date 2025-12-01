'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../atoms/Input';
import { SearchDrawer } from '../organisms/SearchDrawer';

export function SearchBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <div
                className="relative w-full max-w-2xl cursor-pointer"
                onClick={() => setIsDrawerOpen(true)}
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    type="search"
                    placeholder="Rechercher un produit..."
                    className="pl-10 w-full pointer-events-none" // Disable input pointer events to let parent div handle click
                    fullWidth
                    readOnly // Prevent typing in the navbar input
                />
            </div>

            <SearchDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </>
    );
}
