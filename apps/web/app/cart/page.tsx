'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Truck, Lock, ArrowRight, AlertTriangle, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
    const { cart, updateQuantity, removeItem, isLoading } = useCart();
    const [wantsSamples, setWantsSamples] = useState(false);

    const total = cart?.items.reduce((acc, item) => acc + (item.product.priceTTC * item.quantity), 0) || 0;
    const freeShippingThreshold = 60;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
    const shippingProgress = Math.min(100, (total / freeShippingThreshold) * 100);
    const hasStockIssues = cart?.items.some(item => item.quantity > item.product.stock);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe0090]"></div>
            </div>
        );
    }

    if (!cart?.items.length) {
        return (
            <div className="min-h-screen bg-gray-50 pt-18 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag size={64} className="text-[#fe0090]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#3f4c53]">Votre panier est vide</h1>
                        <p className="text-gray-500 mt-4 text-lg">Découvrez nos produits et commencez vos achats dès maintenant !</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-[#fe0090] text-white rounded-xl font-bold hover:bg-[#d4007a] transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-1"
                    >
                        Continuer mes achats
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-32 md:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-[#3f4c53]">Mon Panier ({cart.items.length})</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                        <Lock size={16} className="text-emerald-500" />
                        <span className="font-medium">Paiement 100% sécurisé</span>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Cart Items Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Free Shipping Bar */}
                        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 text-sm md:text-base font-medium text-[#3f4c53] mb-3">
                                <Truck size={20} className="text-[#fe0090]" />
                                {remainingForFreeShipping > 0 ? (
                                    <span>
                                        Plus que <span className="text-[#fe0090] font-bold">{formatPrice(remainingForFreeShipping)}</span> pour la livraison offerte
                                    </span>
                                ) : (
                                    <span className="text-emerald-600 font-bold">Livraison offerte ! 🎉</span>
                                )}
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#fe0090] rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${shippingProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {cart.items.map((item) => {
                                    const isStockIssue = item.quantity > item.product.stock;
                                    return (
                                        <li key={item.id} className={`p-4 md:p-6 transition-colors ${isStockIssue ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                                            <div className="flex gap-4 md:gap-6">
                                                {/* Image - Larger on mobile */}
                                                <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                                    {item.product.imageUrl ? (
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ShoppingBag size={32} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                href={`/product/${item.product.slug}`}
                                                                className="text-base md:text-lg font-semibold text-[#3f4c53] hover:text-[#fe0090] transition-colors line-clamp-2"
                                                            >
                                                                {item.product.name}
                                                            </Link>
                                                            {item.product.stock < 50 && item.product.stock > 0 && (
                                                                <p className="text-sm font-medium text-[#fe0090] mt-1">
                                                                    Plus que {item.product.stock} en stock !
                                                                </p>
                                                            )}
                                                        </div>
                                                        <p className="text-lg md:text-xl font-bold text-[#fe0090] flex-shrink-0">
                                                            {formatPrice(Number(item.product.priceTTC) * item.quantity)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-end justify-between mt-3 md:mt-4">
                                                        <div className="flex flex-col gap-1">
                                                            {/* Stock/Limit Messages */}
                                                            {item.quantity >= item.product.stock && (
                                                                <span className="text-xs text-red-600 font-medium">Rupture de stock</span>
                                                            )}
                                                            {item.product.maxOrderQuantity && item.quantity >= item.product.maxOrderQuantity && item.quantity < item.product.stock && (
                                                                <span className="text-xs text-orange-600 font-medium">Limite atteinte</span>
                                                            )}

                                                            {/* Quantity Controls - Larger on mobile */}
                                                            <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 h-11 md:h-10 w-fit">
                                                                <button
                                                                    onClick={() => {
                                                                        const targetQty = item.quantity > item.product.stock
                                                                            ? item.product.stock
                                                                            : item.quantity - 1;
                                                                        updateQuantity(item.id, targetQty);
                                                                    }}
                                                                    className="px-4 md:px-3 h-full hover:text-[#fe0090] transition-colors flex items-center justify-center disabled:opacity-30 active:scale-95"
                                                                    disabled={item.quantity <= 1 && item.quantity <= item.product.stock}
                                                                >
                                                                    <Minus size={18} strokeWidth={2.5} />
                                                                </button>
                                                                <span className={`w-12 md:w-10 text-center font-bold text-base ${isStockIssue ? 'text-red-600' : 'text-[#3f4c53]'}`}>
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="px-4 md:px-3 h-full hover:text-[#fe0090] transition-colors flex items-center justify-center disabled:opacity-30 active:scale-95"
                                                                    disabled={
                                                                        item.quantity >= item.product.stock ||
                                                                        (item.product.maxOrderQuantity ? item.quantity >= item.product.maxOrderQuantity : false)
                                                                    }
                                                                >
                                                                    <Plus size={18} strokeWidth={2.5} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 active:scale-95"
                                                        >
                                                            <Trash2 size={18} />
                                                            <span className="hidden sm:inline">Supprimer</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Summary Column - Hidden on mobile, shown in sticky bar */}
                    <div className="hidden lg:block lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-[#3f4c53] mb-6">Récapitulatif</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Sous-total</span>
                                    <span className="font-semibold">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Livraison</span>
                                    {remainingForFreeShipping > 0 ? (
                                        <span className="text-sm text-gray-400 italic">Calculé à l'étape suivante</span>
                                    ) : (
                                        <span className="text-emerald-600 font-bold">Offerte</span>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-[#3f4c53]">Total</span>
                                    <span className="text-2xl font-bold text-[#fe0090]">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Samples Checkbox */}
                            <div className="mb-6 bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={wantsSamples}
                                            onChange={(e) => setWantsSamples(e.target.checked)}
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#fe0090] peer-checked:border-[#fe0090] transition-all flex items-center justify-center">
                                            <Check size={14} className={`text-white transition-opacity ${wantsSamples ? 'opacity-100' : 'opacity-0'}`} />
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-[#3f4c53] transition-colors">
                                        J'accepte de recevoir des échantillons de produit (envoi selon disponibilité).
                                    </span>
                                </label>
                            </div>

                            {/* Stock Warning */}
                            {hasStockIssues && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                                    <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                                    <span className="font-medium">Certains produits de votre panier ne sont plus disponibles en quantité suffisante. Veuillez ajuster votre commande.</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                <Link
                                    href="/checkout/login"
                                    className="block w-full bg-[#fe0090] text-white text-center font-bold py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-1 active:translate-y-0"
                                >
                                    Valider mon panier
                                </Link>
                                <Link
                                    href="/"
                                    className="w-full bg-white border-2 border-gray-100 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 flex items-center justify-center"
                                >
                                    Continuer mes achats
                                </Link>
                            </div>

                            {/* Secure Payment Badge */}

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 safe-area-bottom">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-[#fe0090]">{formatPrice(total)}</p>
                        </div>
                        <button
                            disabled={hasStockIssues}
                            className="flex-1 ml-4 bg-[#fe0090] text-white font-bold text-base py-4 px-6 rounded-xl hover:bg-[#d4007a] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            <span>Payer ma commande</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
