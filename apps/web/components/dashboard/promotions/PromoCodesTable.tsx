import { Edit, Trash2, Check, X, Copy } from 'lucide-react';
import Link from 'next/link';
import { PromoCode } from '@/hooks/usePromoCodes';
import { formatPrice } from '@/lib/utils';

interface PromoCodesTableProps {
    promoCodes: PromoCode[];
    loading: boolean;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, currentStatus: boolean) => void;
}

export function PromoCodesTable({ promoCodes, loading, onDelete, onToggleActive }: PromoCodesTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fe0090]"></div>
            </div>
        );
    }

    if (promoCodes.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-lg">Aucun code promo créé pour le moment</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Réduction</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Conditions</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisations</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {promoCodes.map((promo) => (
                            <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-[#3f4c53] bg-gray-100 px-2 py-1 rounded">
                                            {promo.code}
                                        </span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(promo.code)}
                                            className="text-gray-400 hover:text-[#fe0090] transition-colors"
                                            title="Copier"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                    {promo.description && (
                                        <p className="text-xs text-gray-500 mt-1">{promo.description}</p>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="font-medium text-[#fe0090]">
                                        {promo.discountType === 'PERCENTAGE'
                                            ? `-${promo.discountAmount}%`
                                            : `-${formatPrice(promo.discountAmount)}`
                                        }
                                    </div>
                                    {promo.freeShipping && (
                                        <div className="text-xs text-emerald-600 font-medium mt-0.5">
                                            + Livraison offerte
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    {promo.minCartAmount ? (
                                        <div>Min. {formatPrice(promo.minCartAmount)}</div>
                                    ) : (
                                        <div className="text-gray-400">Aucun minimum</div>
                                    )}
                                    {promo.endDate && (
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            Jusqu'au {new Date(promo.endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">{promo.usageCount}</span>
                                        <span className="text-gray-400">/</span>
                                        <span className="text-gray-400">
                                            {promo.usageLimit === null ? '∞' : promo.usageLimit}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => onToggleActive(promo.id, promo.isActive)}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${promo.isActive
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {promo.isActive ? (
                                            <>
                                                <Check size={12} /> Actif
                                            </>
                                        ) : (
                                            <>
                                                <X size={12} /> Inactif
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/dashboard/promotions/promo-codes/${promo.id}`}
                                            className="p-2 text-gray-400 hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-all"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(promo.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
