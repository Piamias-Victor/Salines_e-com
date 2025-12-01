'use client';

import { Save, Loader2 } from 'lucide-react';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { ShippingMethodCard } from '@/components/admin/ShippingMethodCard';

export default function DeliverySettingsPage() {
    const {
        methods,
        isLoading,
        savingId,
        toggleActive,
        updateThreshold,
        addRate,
        updateRate,
        saveAllRates,
        deleteRate,
    } = useShippingSettings();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-[#fe0090]" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Global Save Button */}
            <div className="mb-6 flex justify-end">
                <button
                    onClick={saveAllRates}
                    disabled={savingId === 'all'}
                    className="flex items-center gap-2 bg-[#fe0090] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {savingId === 'all' ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Enregistrement...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Enregistrer toutes les modifications</span>
                        </>
                    )}
                </button>
            </div>

            {/* Shipping Methods */}
            <div className="space-y-8">
                {methods.map((method) => (
                    <ShippingMethodCard
                        key={method.id}
                        method={method}
                        onToggleActive={toggleActive}
                        onUpdateThreshold={updateThreshold}
                        onAddRate={addRate}
                        onRateChange={updateRate}
                        onDeleteRate={deleteRate}
                    />
                ))}
            </div>
        </div>
    );
}
