'use client';

import { ShieldCheck, FileText } from 'lucide-react';

interface MedicationBadgeProps {
    maxOrderQuantity: number | null;
    notice: string | null;
}

export function MedicationBadge({ maxOrderQuantity, notice }: MedicationBadgeProps) {
    return (
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 space-y-2">
            {/* Compact Header */}
            <div className="flex items-center gap-2 text-blue-700">
                <ShieldCheck size={14} className="flex-shrink-0" />
                <span className="text-xs font-medium">Médicament - Produit pharmaceutique</span>
            </div>

            {/* Limit Info - More subtle */}
            {maxOrderQuantity && (
                <p className="text-xs text-blue-600 leading-relaxed">
                    Limite légale : maximum <span className="font-semibold">{maxOrderQuantity} unités</span> par commande
                </p>
            )}

            {/* Notice Link - Small and discrete */}
            {notice && (
                <a
                    href={notice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                    <FileText size={12} />
                    Consulter la notice
                </a>
            )}
        </div>
    );
}
