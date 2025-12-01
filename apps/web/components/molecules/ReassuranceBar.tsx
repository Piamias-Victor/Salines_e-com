import { Truck, ShieldCheck } from 'lucide-react';

export function ReassuranceBar() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Truck size={20} />
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-900">Livraison Rapide</p>
                    <p className="text-xs text-gray-500">Chez vous / En point relais / Click & Collect</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-900">Paiement Sécurisé</p>
                    <p className="text-xs text-gray-500">CB, PayPal, Apple Pay</p>
                </div>
            </div>
        </div>
    );
}
