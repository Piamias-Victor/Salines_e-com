'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { getActivePromotion, calculatePromotionPrice, formatPromotionBadge } from '@/lib/utils/promotion';
import { useWishlist } from '@/contexts/WishlistContext';

// ============================================================================
// Product Card Component
// ============================================================================

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(product.id);
    const { addToCart, isAdding, cart } = useCart();
    const [localIsAdding, setLocalIsAdding] = useState(false);

    // Get brand name from product brands (first brand if multiple)
    const brand = (product as any).brands?.[0]?.brand?.name || null;

    // Calculate promotion
    const activePromotion = getActivePromotion(product as any);
    const priceCalc = calculatePromotionPrice(Number(product.priceTTC), activePromotion);
    const hasPromotion = priceCalc.hasPromotion;
    const finalPrice = priceCalc.finalPrice;
    const originalPrice = priceCalc.originalPrice;

    // Calculate limits
    const cartItem = cart?.items.find(item => item.productId === product.id);
    const currentInCart = cartItem?.quantity || 0;
    const maxOrder = product.maxOrderQuantity || Infinity;
    const effectiveStock = product.stock;

    const isStockLimitReached = currentInCart >= effectiveStock;
    const isOrderLimitReached = currentInCart >= maxOrder;
    const isMaxReached = isStockLimitReached || isOrderLimitReached;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation

        if (isMaxReached) return;

        setLocalIsAdding(true);
        try {
            await addToCart(product.id, 1);
        } catch (error) {
            console.error('Failed to add to cart', error);
        } finally {
            setLocalIsAdding(false);
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLiked) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product.id);
        }
    };

    return (
        <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <Link href={`/product/${product.slug}`} className="block flex-1 flex flex-col">
                {/* Image Container - Larger on mobile */}
                <div className="relative aspect-square overflow-hidden bg-white">
                    <Image
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 p-2"
                    />

                    {/* Promo Badge */}
                    {hasPromotion && activePromotion && (
                        <div className="absolute top-3 right-3 bg-[#fe0090] text-white font-bold px-4 py-2 rounded-lg text-base md:text-sm shadow-lg z-10">
                            {formatPromotionBadge(activePromotion)}
                        </div>
                    )}

                    {/* Like Button - Larger touch target */}
                    <button
                        onClick={handleToggleWishlist}
                        className={`absolute top-3 left-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-md ${isLiked
                            ? 'bg-[#fe0090] text-white'
                            : 'bg-white/95 text-gray-400 hover:text-[#fe0090]'
                            }`}
                        aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Content - Better spacing and typography */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Brand */}
                    {brand && (
                        <p className="text-xs md:text-xs text-[#fe0090] font-bold uppercase tracking-wide mb-1.5">
                            {brand}
                        </p>
                    )}

                    {/* Product Name - Larger, more readable */}
                    <h3 className="font-semibold text-[#3f4c53] text-base md:text-sm mb-3 line-clamp-2 flex-1 group-hover:text-[#fe0090] transition-colors leading-snug">
                        {product.name}
                    </h3>

                    {/* Price - More prominent */}
                    <div className="flex items-baseline gap-2 mb-1">
                        {hasPromotion ? (
                            <>
                                <span className="text-2xl md:text-xl font-bold text-[#fe0090]">
                                    {formatPrice(finalPrice)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl md:text-xl font-bold text-[#3f4c53]">
                                {formatPrice(Number(product.priceTTC))}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button - Larger touch target */}
            <div className="p-4 pt-0">
                <button
                    onClick={handleAddToCart}
                    disabled={localIsAdding || product.stock <= 0 || isMaxReached}
                    className="w-full bg-[#fe0090] text-white font-bold py-3.5 md:py-3 px-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    aria-label="Ajouter au panier"
                >
                    {localIsAdding ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <ShoppingCart size={20} />
                    )}
                    <span className="text-sm md:text-sm font-bold">
                        {localIsAdding
                            ? 'Ajout...'
                            : product.stock <= 0
                                ? 'Rupture de stock'
                                : isStockLimitReached
                                    ? 'Rupture de stock'
                                    : isOrderLimitReached
                                        ? 'Limite atteinte'
                                        : 'Ajouter au panier'}
                    </span>
                </button>
            </div>
        </div>
    );
}
