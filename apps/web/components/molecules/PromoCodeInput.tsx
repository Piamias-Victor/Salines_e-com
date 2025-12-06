'use client';

import { useState } from 'react';
import { Tag, Loader2, X, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export function PromoCodeInput() {
    const { cart, applyPromoCode, removePromoCode, isLoading } = useCart();
    const [code, setCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsApplying(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await applyPromoCode(code);
            if (result.success) {
                setSuccess('Code appliqué !');
                setCode('');
            } else {
                setError(result.error || 'Code invalide');
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemove = async () => {
        setIsApplying(true);
        try {
            await removePromoCode();
            setSuccess(null);
            setError(null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsApplying(false);
        }
    };

    // Si un code est déjà appliqué
    if (cart?.appliedPromoCode) {
        return (
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#fe0090] font-medium">
                        <Tag size={16} />
                        <span>Code promo appliqué</span>
                    </div>
                    <button
                        onClick={handleRemove}
                        disabled={isApplying}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Retirer le code"
                    >
                        {isApplying ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-800 bg-white px-2 py-1 rounded border border-pink-100">
                        {cart.appliedPromoCode}
                    </span>
                    {cart.promoCode && (
                        <span className="text-emerald-600 font-bold text-sm">
                            -{cart.promoCode.discountType === 'PERCENTAGE'
                                ? `${cart.promoCode.discountAmount}%`
                                : formatPrice(Number(cart.promoCode.discountAmount))
                            }
                        </span>
                    )}
                </div>
                {cart.promoCode?.freeShipping && (
                    <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                        <Check size={12} />
                        Livraison offerte
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <form onSubmit={handleApply} className="relative">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setError(null);
                        setSuccess(null);
                    }}
                    placeholder="Code promo"
                    className={`w-full pl-10 pr-24 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-mono uppercase placeholder:font-sans ${error ? 'border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-100' :
                            success ? 'border-emerald-200 focus:border-emerald-500' :
                                'border-gray-200 focus:border-[#fe0090] focus:ring-2 focus:ring-pink-100'
                        }`}
                />
                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <button
                    type="submit"
                    disabled={!code.trim() || isApplying}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white text-[#fe0090] font-bold text-sm rounded-lg border border-pink-100 hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isApplying ? <Loader2 size={16} className="animate-spin" /> : 'Appliquer'}
                </button>
            </form>

            {error && (
                <p className="text-xs text-red-500 ml-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-xs text-emerald-600 ml-1 animate-in slide-in-from-top-1 flex items-center gap-1">
                    <Check size={12} /> {success}
                </p>
            )}
        </div>
    );
}
