'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Heart, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getActivePromotion, calculatePromotionPrice, formatPromotionBadge } from '@/lib/utils/promotion';
import { ReassuranceBar } from './ReassuranceBar';
import { useCart } from '@/hooks/useCart';

interface AddToCartSectionProps {
    product: {
        id: string;
        priceTTC: number;
        stock: number;
        maxOrderQuantity?: number | null;
        promotions?: any[]; // Add promotions
    };
    unitPrice?: string | null;
}

export function AddToCartSection({ product, unitPrice }: AddToCartSectionProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isAdding, cart } = useCart();

    // Calculate promotion
    const activePromotion = getActivePromotion(product as any);
    const priceCalc = calculatePromotionPrice(Number(product.priceTTC), activePromotion);
    const hasPromotion = priceCalc.hasPromotion;
    const finalPrice = priceCalc.finalPrice;
    const originalPrice = priceCalc.originalPrice;
    const [error, setError] = useState<string | null>(null);

    // Calculate current quantity in cart for this product
    const cartItem = cart?.items.find(item => item.productId === product.id);
    const currentInCart = cartItem?.quantity || 0;

    // Determine effective max quantity (min of stock and maxOrderQuantity)
    const maxOrder = product.maxOrderQuantity || Infinity;
    const effectiveStock = product.stock;

    // Calculate how many more can be added
    const remainingAllowed = Math.max(0, Math.min(effectiveStock, maxOrder) - currentInCart);
    const isMaxReached = remainingAllowed <= 0;

    const isStockLimitReached = currentInCart >= effectiveStock;
    const isOrderLimitReached = currentInCart >= maxOrder;

    const handleQuantityChange = (value: number) => {
        if (value < 1) return;
        if (value > remainingAllowed) return;
        setQuantity(value);
        setError(null);
    };

    const handleAddToCart = async () => {
        setError(null);

        if (isMaxReached) {
            if (isStockLimitReached) {
                setError(`Rupture de stock : vous avez ajouté tous les articles disponibles.`);
            } else {
                setError(`Limite de ${maxOrder} articles atteinte pour ce produit.`);
            }
            return;
        }

        try {
            await addToCart(product.id, quantity);
            setQuantity(1); // Reset to 1 after success
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'ajout au panier');
        }
    };

    return (
        <>
            {/* Desktop/Tablet View */}
            <div className="space-y-6 md:space-y-8 pb-32 md:pb-0">
                {/* Price Block */}
                <div>
                    {/* Promotion Badge */}
                    {hasPromotion && activePromotion && (
                        <div className="inline-block bg-[#fe0090] text-white font-bold px-4 py-2 rounded-lg text-base mb-3 shadow-lg">
                            {formatPromotionBadge(activePromotion)}
                        </div>
                    )}

                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl md:text-5xl font-bold text-[#fe0090] tracking-tight">
                            {formatPrice(hasPromotion ? finalPrice : Number(product.priceTTC))}
                        </span>
                        {hasPromotion && (
                            <span className="text-2xl text-gray-400 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                    {unitPrice && (
                        <p className="text-sm text-gray-500 mt-1">
                            {unitPrice}
                        </p>
                    )}
                </div>

                {/* Stock Status */}
                {product.stock > 0 ? (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-base">En stock</span>
                        </div>
                        {product.stock < 50 && (
                            <p className="text-base font-bold text-[#fe0090] animate-pulse">
                                Plus que {product.stock} en stock !
                            </p>
                        )}
                        {product.stock >= 50 && (
                            <p className="text-sm text-gray-500">
                                {product.stock} articles disponibles
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                        <span className="font-semibold text-base">Rupture de stock</span>
                    </div>
                )}

                {/* Max Quantity Info */}
                {product.maxOrderQuantity && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span>Limite : {product.maxOrderQuantity} par commande</span>
                        {currentInCart > 0 && (
                            <span className="text-[#fe0090]">({currentInCart} dans le panier)</span>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                {/* Desktop Actions Bar */}
                <div className="hidden md:flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                    {/* Quantity */}
                    <div className={`flex items-center justify-between md:justify-start bg-gray-50 rounded-xl border border-gray-200 ${isMaxReached ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="p-3 hover:text-[#fe0090] transition-colors disabled:opacity-50"
                            disabled={quantity <= 1 || isAdding}
                        >
                            <Minus size={20} />
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            min={1}
                            max={remainingAllowed}
                            className="w-12 text-center bg-transparent font-semibold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isAdding}
                        />
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="p-3 hover:text-[#fe0090] transition-colors disabled:opacity-50"
                            disabled={quantity >= remainingAllowed || isAdding}
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || product.stock <= 0 || isMaxReached}
                        className="flex-1 bg-[#fe0090] text-white font-bold text-lg py-3 md:py-0 rounded-xl hover:bg-[#d4007a] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                        {isAdding ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <ShoppingCart size={24} />
                        )}
                        <span>
                            {isAdding
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

                    {/* Wishlist */}
                    <button className="p-3 md:p-4 rounded-xl border-2 border-gray-100 text-gray-400 hover:border-[#fe0090] hover:text-[#fe0090] hover:bg-pink-50 transition-all duration-300 flex items-center justify-center">
                        <Heart size={24} />
                    </button>
                </div>

                {/* Reassurance Elements */}
                <ReassuranceBar />
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 safe-area-bottom">
                <div className="px-4 py-4 space-y-3">
                    {/* Quantity Selector - Larger for mobile */}
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-600">Quantité</span>
                        <div className={`flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 ${isMaxReached ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                className="p-4 hover:text-[#fe0090] transition-colors disabled:opacity-50 active:scale-95"
                                disabled={quantity <= 1 || isAdding}
                            >
                                <Minus size={22} strokeWidth={2.5} />
                            </button>
                            <span className="w-14 text-center font-bold text-xl text-gray-900">
                                {quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                className="p-4 hover:text-[#fe0090] transition-colors disabled:opacity-50 active:scale-95"
                                disabled={quantity >= remainingAllowed || isAdding}
                            >
                                <Plus size={22} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Price + Add to Cart Button */}
                    <div className="flex items-center gap-3">
                        {/* Price */}
                        <div className="flex-1">
                            {hasPromotion && activePromotion && (
                                <div className="inline-block bg-[#fe0090] text-white font-bold px-2 py-1 rounded text-xs mb-1">
                                    {formatPromotionBadge(activePromotion)}
                                </div>
                            )}
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-[#fe0090]">
                                    {formatPrice(hasPromotion ? finalPrice : Number(product.priceTTC))}
                                </p>
                                {hasPromotion && (
                                    <p className="text-sm text-gray-400 line-through">
                                        {formatPrice(originalPrice)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock <= 0 || isMaxReached}
                            className="flex-1 bg-[#fe0090] text-white font-bold text-base py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            {isAdding ? (
                                <Loader2 size={22} className="animate-spin" />
                            ) : (
                                <ShoppingCart size={22} />
                            )}
                            <span>
                                {isAdding
                                    ? 'Ajout...'
                                    : product.stock <= 0
                                        ? 'Rupture'
                                        : isStockLimitReached
                                            ? 'Rupture'
                                            : isOrderLimitReached
                                                ? 'Limite'
                                                : 'Ajouter'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}


