'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { PromoCode } from '@/hooks/usePromoCodes';

interface PromoCodeFormProps {
    initialData?: PromoCode;
}

export function PromoCodeForm({ initialData }: PromoCodeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shippingMethods, setShippingMethods] = useState<any[]>([]);

    useEffect(() => {
        const fetchShippingMethods = async () => {
            try {
                const res = await fetch('/api/admin/shipping-methods');
                if (res.ok) {
                    const data = await res.json();
                    setShippingMethods(data);
                }
            } catch (err) {
                console.error('Failed to fetch shipping methods', err);
            }
        };
        fetchShippingMethods();
    }, []);

    const [formData, setFormData] = useState({
        code: initialData?.code || '',
        description: initialData?.description || '',
        discountType: initialData?.discountType || 'EURO',
        discountAmount: initialData?.discountAmount || 0,
        minCartAmount: initialData?.minCartAmount || 0,
        freeShipping: initialData?.freeShipping || false,
        freeShippingMethodId: initialData?.freeShippingMethodId || null,
        usageLimit: initialData?.usageLimit || '',
        perUserLimit: initialData?.perUserLimit || '',
        isActive: initialData?.isActive ?? true,
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = initialData
                ? `/api/admin/promo-codes/${initialData.id}`
                : '/api/admin/promo-codes';

            const method = initialData ? 'PATCH' : 'POST';

            const payload = {
                ...formData,
                discountAmount: Number(formData.discountAmount),
                minCartAmount: formData.minCartAmount ? Number(formData.minCartAmount) : null,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
                perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : null,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle Zod errors or custom errors
                if (data.error && Array.isArray(data.error)) {
                    throw new Error(data.error[0].message);
                }
                throw new Error(data.error || 'Une erreur est survenue');
            }

            router.push('/dashboard/promotions');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/promotions"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {initialData ? 'Modifier le code promo' : 'Nouveau code promo'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {initialData ? `Code: ${initialData.code}` : 'Créez un nouveau code de réduction'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                    <Info size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code promo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="ex: NOEL2024"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all font-mono uppercase"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Uniquement majuscules, chiffres, tirets et underscores.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (interne)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description pour l'équipe..."
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discount Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Réduction</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type de réduction *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="discountType"
                                            value="EURO"
                                            checked={formData.discountType === 'EURO'}
                                            onChange={(e) => setFormData({ ...formData, discountType: 'EURO' as any })}
                                            className="sr-only peer"
                                        />
                                        <div className="p-4 rounded-xl border-2 border-gray-100 peer-checked:border-[#fe0090] peer-checked:bg-pink-50 transition-all text-center">
                                            <span className="font-bold text-gray-900 peer-checked:text-[#fe0090]">Montant fixe (€)</span>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="discountType"
                                            value="PERCENTAGE"
                                            checked={formData.discountType === 'PERCENTAGE'}
                                            onChange={(e) => setFormData({ ...formData, discountType: 'PERCENTAGE' as any })}
                                            className="sr-only peer"
                                        />
                                        <div className="p-4 rounded-xl border-2 border-gray-100 peer-checked:border-[#fe0090] peer-checked:bg-pink-50 transition-all text-center">
                                            <span className="font-bold text-gray-900 peer-checked:text-[#fe0090]">Pourcentage (%)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valeur de la réduction *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.discountAmount}
                                        onChange={(e) => setFormData({ ...formData, discountAmount: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all pl-12"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                                        {formData.discountType === 'EURO' ? '€' : '%'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="freeShipping"
                                    checked={formData.freeShipping}
                                    onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                                    className="w-5 h-5 text-[#fe0090] rounded focus:ring-[#fe0090] border-gray-300"
                                />
                                <label htmlFor="freeShipping" className="text-sm font-medium text-gray-900 cursor-pointer select-none">
                                    Offrir la livraison avec ce code
                                </label>
                            </div>

                            {formData.freeShipping && (
                                <div className="pl-8 animate-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Restreindre à un mode de livraison (optionnel)
                                    </label>
                                    <select
                                        value={formData.freeShippingMethodId || ''}
                                        onChange={(e) => setFormData({ ...formData, freeShippingMethodId: e.target.value || null })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Tous les modes de livraison</option>
                                        {shippingMethods.map((method) => (
                                            <option key={method.id} value={method.id}>
                                                {method.name} ({method.type})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Si sélectionné, la livraison ne sera offerte que pour ce mode spécifique.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conditions d'application</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Montant minimum du panier (€)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.minCartAmount}
                                    onChange={(e) => setFormData({ ...formData, minCartAmount: Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">Laisser 0 pour aucun minimum</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statut</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Activer le code</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fe0090]"></div>
                            </label>
                        </div>
                    </div>

                    {/* Limits */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Limites</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Limite d'utilisation totale
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    placeholder="Illimité"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Limite par utilisateur
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.perUserLimit}
                                    onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                                    placeholder="Illimité"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Validité</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#fe0090] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#fe0090] text-white font-bold py-4 rounded-xl hover:bg-[#d4007a] transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Enregistrer le code
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
