'use client';

import { Printer, FileText } from 'lucide-react';

interface OrdersActionsBarProps {
    selectedCount: number;
    onGeneratePreparationSheet: () => void;
    onGenerateDeliveryNotes: () => void;
}

export function OrdersActionsBar({
    selectedCount,
    onGeneratePreparationSheet,
    onGenerateDeliveryNotes
}: OrdersActionsBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="bg-[#fe0090] text-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
            <span className="font-medium">
                {selectedCount} commande(s) sélectionnée(s)
            </span>
            <div className="flex gap-2">
                <button
                    onClick={onGeneratePreparationSheet}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#fe0090] rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Printer size={18} />
                    Bon de préparation
                </button>
                <button
                    onClick={onGenerateDeliveryNotes}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#fe0090] rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <FileText size={18} />
                    Bons de livraison
                </button>
            </div>
        </div>
    );
}
