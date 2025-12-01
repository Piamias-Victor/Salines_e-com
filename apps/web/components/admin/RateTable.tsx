import { Trash2 } from 'lucide-react';

interface ShippingRate {
    id: string;
    minWeight: number;
    maxWeight: number;
    price: number;
}

interface RateTableProps {
    rates: ShippingRate[];
    methodId: string;
    onRateChange: (methodId: string, rateId: string, field: 'minWeight' | 'maxWeight' | 'price', value: string) => void;
    onDeleteRate: (rateId: string) => void;
}

export function RateTable({ rates, methodId, onRateChange, onDeleteRate }: RateTableProps) {
    const sortedRates = [...rates].sort((a, b) => Number(a.minWeight) - Number(b.minWeight));

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Poids min (kg)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Poids max (kg)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prix</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRates.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                                Aucun tarif configuré
                            </td>
                        </tr>
                    ) : (
                        sortedRates.map((rate) => (
                            <tr key={rate.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={rate.minWeight}
                                        onChange={(e) => onRateChange(methodId, rate.id, 'minWeight', e.target.value)}
                                        className="w-20 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-[#fe0090]"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={rate.maxWeight}
                                        onChange={(e) => onRateChange(methodId, rate.id, 'maxWeight', e.target.value)}
                                        className="w-20 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-[#fe0090]"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={rate.price}
                                            onChange={(e) => onRateChange(methodId, rate.id, 'price', e.target.value)}
                                            className="w-20 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-[#fe0090] font-bold text-[#fe0090]"
                                        />
                                        <span className="text-gray-500">€</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onDeleteRate(rate.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
