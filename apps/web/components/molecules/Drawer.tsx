'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

// ============================================================================
// Drawer Component
// ============================================================================

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function Drawer({ isOpen, onClose, children, title, className }: DrawerProps) {
    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    'fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {title && (
                        <h2 className="text-lg font-bold text-[#3f4c53]">{title}</h2>
                    )}
                    <button
                        onClick={onClose}
                        className="ml-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Fermer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    );
}
