'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
    wishlistItems: string[]; // Array of product IDs
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user, accessToken } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch wishlist on mount or when user changes
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user || !accessToken) {
                setWishlistItems([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch('/api/user/wishlist', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Extract product IDs
                    const ids = data.wishlistItems.map((item: any) => item.product.id);
                    setWishlistItems(ids);
                }
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [user, accessToken]);

    const addToWishlist = async (productId: string) => {
        if (!user || !accessToken) {
            toast.error('Veuillez vous connecter pour ajouter aux favoris');
            return;
        }

        // Optimistic update
        setWishlistItems((prev) => [...prev, productId]);
        toast.success('Ajouté aux favoris');

        try {
            const response = await fetch('/api/user/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add');
            }
        } catch (error) {
            console.error('Add to wishlist error:', error);
            // Revert optimistic update
            setWishlistItems((prev) => prev.filter((id) => id !== productId));
            toast.error('Erreur lors de l\'ajout aux favoris');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user || !accessToken) return;

        // Optimistic update
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast.success('Retiré des favoris');

        try {
            const response = await fetch(`/api/user/wishlist?productId=${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove');
            }
        } catch (error) {
            console.error('Remove from wishlist error:', error);
            // Revert optimistic update
            setWishlistItems((prev) => [...prev, productId]);
            toast.error('Erreur lors de la suppression des favoris');
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.includes(productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                isLoading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
