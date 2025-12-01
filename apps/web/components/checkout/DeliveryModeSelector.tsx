import { memo, useMemo } from 'react';
import { Store, Truck, Package, Check, Loader2 } from 'lucide-react';
import { type DeliveryMode } from '@/contexts/CheckoutContext';

interface ShippingMethod {
    id: string;
    name: string;
    type: string;
    description: string;
    freeShippingThreshold: number | null;
}

interface DeliveryModeSelectorProps {
    shippingMethods: ShippingMethod[];
    shippingCosts: Record<string, number>;
    selectedMode: DeliveryMode | null;
    isLoading: boolean;
    isAddressValid: boolean;
    onSelectMode: (mode: DeliveryMode) => void;
}

const ICON_MAP = {
    PHARMACY: Store,
    HOME: Truck,
    RELAY: Package,
} as const;

const BG_COLOR_MAP = {
    PHARMACY: 'bg-blue-100 text-blue-600',
    HOME: 'bg-green-100 text-green-600',
    RELAY: 'bg-purple-100 text-purple-600',
} as const;

export const DeliveryModeSelector = memo(function DeliveryModeSelector({
    shippingMethods,
    shippingCosts,
    selectedMode,
    isLoading,
    isAddressValid,
    onSelectMode,
}: DeliveryModeSelectorProps) {
    const getIcon = (type: string) => ICON_MAP[type as keyof typeof ICON_MAP] || Package;
    const getBgColor = (type: string) => BG_COLOR_MAP[type as keyof typeof BG_COLOR_MAP] || 'bg-gray-100 text-gray-600';

    const methodCards = useMemo(() => {
        return shippingMethods.map((method) => {
            const Icon = getIcon(method.type);
            const bgColor = getBgColor(method.type);
            const cost = shippingCosts[method.type] ?? 0;
            const priceDisplay = cost === 0 ? 'Gratuit' : `${cost.toFixed(2)}€`;

            return (
                <button
                    key={method.id}
                    type="button"
                    onClick={() => onSelectMode(method.type as DeliveryMode)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${selectedMode === method.type
                        ? 'border-[#fe0090] bg-pink-50'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-gray-900">{method.name}</h3>
                            <span className="font-bold text-[#fe0090]">{priceDisplay}</span>
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                        {method.freeShippingThreshold && cost > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                                Gratuit dès {Number(method.freeShippingThreshold).toFixed(2)}€ d'achat
                            </p>
                        )}
                    </div>
                    {selectedMode === method.type && <Check size={20} className="text-[#fe0090]" />}
                </button>
            );
        });
    }, [shippingMethods, shippingCosts, selectedMode, onSelectMode]);

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-500 ${isAddressValid ? 'opacity-100' : 'opacity-50 grayscale pointer-events-none'
                }`}
        >
            <h2 className="text-xl font-bold text-[#3f4c53] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#fe0090] text-white flex items-center justify-center text-sm">
                    2
                </span>
                Mode de livraison
            </h2>

            {!isAddressValid && (
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm">
                    Veuillez d'abord renseigner votre adresse pour voir les modes de livraison disponibles.
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <Loader2 className="animate-spin text-[#fe0090] mx-auto" size={24} />
                    </div>
                ) : (
                    methodCards
                )}
            </div>
        </div>
    );
});
