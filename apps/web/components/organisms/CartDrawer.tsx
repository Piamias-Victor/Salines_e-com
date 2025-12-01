'use client';

import { X, Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
    const { cart, isCartOpen, closeCart, updateQuantity, removeItem, isLoading } = useCart();

    // Remove the conditional return to allow animations
    // if (!isCartOpen) return null; 

    const total = cart?.items.reduce((acc, item) => acc + (item.product.priceTTC * item.quantity), 0) || 0;
    const freeShippingThreshold = 60;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
    const shippingProgress = Math.min(100, (total / freeShippingThreshold) * 100);

    // Check for stock issues
    const hasStockIssues = cart?.items.some(item => item.quantity > item.product.stock);

    return (
        <>
            {/* Backdrop with blur */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeCart}
            />

            {/* Drawer / Bottom Sheet */}
            <div
                className={`fixed bottom-0 inset-x-0 w-full bg-white z-50 shadow-2xl flex flex-col rounded-t-2xl md:inset-y-0 md:right-0 md:left-auto md:max-w-md md:rounded-none md:h-full transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) max-h-[85vh] md:max-h-full ${isCartOpen
                    ? 'translate-y-0 md:translate-x-0'
                    : 'translate-y-full md:translate-y-0 md:translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10 rounded-t-2xl md:rounded-none">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#3f4c53] flex items-center gap-2">
                            Mon Panier
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {cart?.items.length || 0}
                            </span>
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X size={24} className="text-gray-400 group-hover:text-[#3f4c53]" />
                    </button>
                </div>

                {/* Free Shipping Progress */}
                <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-pink-50 to-white border-b border-pink-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#3f4c53] mb-2">
                        <Truck size={16} className="text-[#fe0090]" />
                        {remainingForFreeShipping > 0 ? (
                            <span>
                                Plus que <span className="text-[#fe0090] font-bold">{formatPrice(remainingForFreeShipping)}</span> pour la livraison offerte
                            </span>
                        ) : (
                            <span className="text-emerald-600 font-bold">Livraison offerte ! 🎉</span>
                        )}
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#fe0090] rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${shippingProgress}%` }}
                        />
                    </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fe0090]"></div>
                        </div>
                    ) : !cart?.items.length ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag size={40} className="text-[#fe0090]" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[#3f4c53]">Votre panier est vide</p>
                                <p className="text-gray-500 mt-2 max-w-xs mx-auto">Découvrez nos produits et commencez vos achats dès maintenant !</p>
                            </div>
                            <button
                                onClick={closeCart}
                                className="px-8 py-3 bg-[#fe0090] text-white rounded-full font-bold hover:bg-[#d4007a] transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5"
                            >
                                Continuer mes achats
                            </button>
                        </div>
                    ) : (
                        cart.items.map((item) => {
                            const isStockIssue = item.quantity > item.product.stock;
                            return (
                                <div key={item.id} className={`group flex gap-4 animate-in slide-in-from-bottom-2 duration-500 ${isStockIssue ? 'bg-red-50 p-2 rounded-xl border border-red-100' : ''}`}>
                                    {/* Image */}
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:border-pink-100 transition-colors">
                                        {item.product.imageUrl ? (
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ShoppingBag size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between gap-2">
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                onClick={closeCart}
                                                className="text-sm font-semibold text-[#3f4c53] line-clamp-2 hover:text-[#fe0090] transition-colors"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1 -mr-2 -mt-2"
                                                aria-label="Supprimer"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {isStockIssue && (
                                            <div className="flex items-center gap-1 text-xs text-red-600 font-medium mt-1">
                                                <AlertTriangle size={12} />
                                                <span>Stock insuffisant : {item.product.stock} dispo</span>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-1 mt-2">
                                            {/* Stock/Limit Messages */}
                                            {item.quantity >= item.product.stock && (
                                                <span className="text-xs text-red-600 font-medium">Rupture de stock</span>
                                            )}
                                            {item.product.maxOrderQuantity && item.quantity >= item.product.maxOrderQuantity && item.quantity < item.product.stock && (
                                                <span className="text-xs text-orange-600 font-medium">Limite atteinte</span>
                                            )}

                                            <div className="flex items-end justify-between">
                                                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8 md:h-9">
                                                    <button
                                                        onClick={() => {
                                                            const targetQty = item.quantity > item.product.stock
                                                                ? item.product.stock
                                                                : item.quantity - 1;
                                                            updateQuantity(item.id, targetQty);
                                                        }}
                                                        className="px-2 md:px-3 h-full hover:text-[#fe0090] transition-colors flex items-center justify-center disabled:opacity-30"
                                                        disabled={item.quantity <= 1 && item.quantity <= item.product.stock}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className={`w-6 md:w-8 text-center text-sm font-semibold ${isStockIssue ? 'text-red-600' : 'text-[#3f4c53]'}`}>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-2 md:px-3 h-full hover:text-[#fe0090] transition-colors flex items-center justify-center disabled:opacity-30"
                                                        disabled={
                                                            item.quantity >= item.product.stock ||
                                                            (item.product.maxOrderQuantity ? item.quantity >= item.product.maxOrderQuantity : false)
                                                        }
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[#fe0090] font-bold text-lg">
                                                        {formatPrice(Number(item.product.priceTTC) * item.quantity)}
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-gray-400 hidden md:block">
                                                            {formatPrice(Number(item.product.priceTTC))} / unité
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {cart?.items.length ? (
                    <div className="p-4 md:p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10 pb-8 md:pb-6">
                        <div className="space-y-3 mb-4 md:mb-6">
                            <div className="flex items-center justify-between text-gray-500">
                                <span>Sous-total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-500">
                                <span>Livraison</span>
                                {remainingForFreeShipping > 0 ? (
                                    <span>Calculé à l'étape suivante</span>
                                ) : (
                                    <span className="text-emerald-600 font-medium">Offerte</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between text-xl font-bold text-[#3f4c53] pt-3 border-t border-gray-100">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {hasStockIssues && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                <span>Veuillez ajuster les quantités pour continuer.</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            {hasStockIssues ? (
                                <button
                                    disabled
                                    className="w-full bg-[#fe0090] text-white font-bold py-3.5 md:py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                >
                                    <span>Valider mon panier</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <Link
                                    href="/checkout/login"
                                    onClick={closeCart}
                                    className="w-full bg-[#fe0090] text-white font-bold py-3.5 md:py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group"
                                >
                                    <span>Valider mon panier</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}

                            <button
                                onClick={closeCart}
                                className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 md:py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center md:hidden"
                            >
                                Continuer mes achats
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
