'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useCart } from '@/hooks/useCart';

export function CartButton() {
    const { cart, toggleCart } = useCart();
    const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <Button
            variant="ghost"
            size="md"
            className="relative"
            onClick={toggleCart}
        >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fe0090] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in">
                    {itemCount}
                </span>
            )}
        </Button>
    );
}
