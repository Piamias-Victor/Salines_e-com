'use client';

import { ShieldCheck, FileText } from 'lucide-react';

interface MedicationBadgeProps {
    maxOrderQuantity: number | null;
    notice: string | null;
}

export function MedicationBadge({ maxOrderQuantity, notice }: MedicationBadgeProps) {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 space-y-3">
            {/* Badge Header */}
            <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="text-white" size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-blue-900">Médicament</h3>
                    <p className="text-xs text-blue-700">Produit pharmaceutique</p>
                </div>
            </div>

            {/* Limit Info */}
            {maxOrderQuantity && (
                <div className="flex items-start gap-2 text-xs text-blue-800 bg-white/50 rounded-lg p-3">
                    <Info className="flex-shrink-0 text-blue-600 mt-0.5" size={14} />
                    <div>
                        <p className="font-semibold">Limite légale de commande</p>
                        <p className="mt-1">Maximum <span className="font-bold">{maxOrderQuantity} unités</span> par commande pour ce médicament, conformément à la réglementation.</p>
                    </div>
                </div>
            )}

            {/* Notice Button */}
            {notice && (
                <a
                    href={notice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <FileText size={16} />
                    Consulter la notice
                </a>
            )}
        </div>
    );
}

function Info({ size, className }: { size: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="currentColor"
            className={className}
        >
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
            />
        </svg>
    );
}
