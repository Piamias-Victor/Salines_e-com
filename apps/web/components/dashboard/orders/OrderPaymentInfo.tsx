'use client';

import { CreditCard, CheckCircle, Clock } from 'lucide-react';

interface OrderPaymentInfoProps {
    paymentStatus: string;
    paymentMethod: string | null;
    subtotal: number;
    shippingCost: number;
    total: number;
}

export function OrderPaymentInfo({
    paymentStatus,
    paymentMethod,
    subtotal,
    shippingCost,
    total
}: OrderPaymentInfoProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#3f4c53] mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Paiement
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {paymentStatus === 'PAID' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {paymentStatus === 'PAID' ? 'Payé' : paymentStatus}
                    </span>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Méthode</p>
                    <p className="font-medium capitalize">{paymentMethod || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Sous-total</p>
                    <p className="font-medium">{Number(subtotal).toFixed(2)} €</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Frais de port</p>
                    <p className="font-medium">{Number(shippingCost).toFixed(2)} €</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">Total</p>
                        <p className="font-bold text-xl text-[#fe0090]">{Number(total).toFixed(2)} €</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
