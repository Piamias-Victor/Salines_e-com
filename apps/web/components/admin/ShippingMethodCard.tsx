import { Store, Truck, Package, Plus } from 'lucide-react';
import { RateTable } from './RateTable';

interface ShippingRate {
    id: string;
    minWeight: number;
    maxWeight: number;
    price: number;
}

interface ShippingMethod {
    id: string;
    name: string;
    type: 'PHARMACY' | 'HOME' | 'RELAY';
    description: string;
    isActive: boolean;
    freeShippingThreshold: number | null;
    rates: ShippingRate[];
}

interface ShippingMethodCardProps {
    method: ShippingMethod;
    onToggleActive: (method: ShippingMethod) => void;
    onUpdateThreshold: (method: ShippingMethod, value: string) => void;
    onAddRate: (methodId: string) => void;
    onRateChange: (methodId: string, rateId: string, field: 'minWeight' | 'maxWeight' | 'price', value: string) => void;
    onDeleteRate: (rateId: string) => void;
}

export function ShippingMethodCard({
    method,
    onToggleActive,
    onUpdateThreshold,
    onAddRate,
    onRateChange,
    onDeleteRate,
}: ShippingMethodCardProps) {
    const getIcon = () => {
        switch (method.type) {
            case 'PHARMACY':
                return Store;
            case 'HOME':
                return Truck;
            case 'RELAY':
                return Package;
        }
    };

    const getBgColor = () => {
        switch (method.type) {
            case 'PHARMACY':
                return 'bg-blue-100 text-blue-600';
            case 'HOME':
                return 'bg-green-100 text-green-600';
            case 'RELAY':
                return 'bg-purple-100 text-purple-600';
        }
    };

    const Icon = getIcon();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getBgColor()}`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                </div>
                <button
                    onClick={() => onToggleActive(method)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${method.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                >
                    {method.isActive ? 'Actif' : 'Inactif'}
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
                {/* Free Shipping Threshold */}
                {method.type !== 'PHARMACY' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seuil de gratuité (€)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={method.freeShippingThreshold || ''}
                            onChange={(e) => onUpdateThreshold(method, e.target.value)}
                            placeholder="Ex: 50"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Laisser vide pour ne jamais offrir la livraison gratuite
                        </p>
                    </div>
                )}

                {/* Rates Table */}
                {method.type !== 'PHARMACY' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Tarifs par poids</h4>
                            <button
                                onClick={() => onAddRate(method.id)}
                                className="flex items-center gap-2 text-[#fe0090] hover:bg-pink-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus size={16} />
                                Ajouter un tarif
                            </button>
                        </div>
                        <RateTable
                            rates={method.rates}
                            methodId={method.id}
                            onRateChange={onRateChange}
                            onDeleteRate={onDeleteRate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
