'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: {
        name: string;
        priceTTC: number;
        imageUrl: string;
        slug: string;
        weight: number | null;
        stock: number;
        maxOrderQuantity?: number;
    };
}

interface Cart {
    id: string;
    items: CartItem[];
}

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    isAdding: boolean;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addToCart: (productId: string, quantity: number) => Promise<boolean>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
    getTotalWeight: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const fetchCart = useCallback(async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Failed to fetch cart', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const addToCart = async (productId: string, quantity: number) => {
        setIsAdding(true);
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to add to cart');
            }

            await fetchCart();
            openCart(); // Automatically open cart on add
            return true;
        } catch (error) {
            console.error('Add to cart error', error);
            throw error;
        } finally {
            setIsAdding(false);
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            const res = await fetch(`/api/cart/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }),
            });

            if (!res.ok) throw new Error('Failed to update quantity');

            await fetchCart();
        } catch (error) {
            console.error('Update quantity error', error);
            throw error;
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            const res = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to remove item');

            await fetchCart();
        } catch (error) {
            console.error('Remove item error', error);
            throw error;
        }
    };

    const getTotalWeight = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => {
            const weight = item.product.weight ? Number(item.product.weight) : 0;
            return total + (weight * item.quantity);
        }, 0);
    };

    const getTotalPrice = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => {
            return total + (item.product.priceTTC * item.quantity);
        }, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                isAdding,
                isCartOpen,
                openCart,
                closeCart,
                toggleCart,
                addToCart,
                updateQuantity,
                removeItem,
                refreshCart: fetchCart,
                getTotalWeight,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
}
