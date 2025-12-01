'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPaymentPage() {
    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#3f4c53] mb-4">Paiement (Mockup)</h1>
            <p className="text-gray-500 mb-8">
                Cette étape sera implémentée ultérieurement avec Stripe/PayPal.
            </p>
            <Link
                href="/"
                className="inline-block bg-[#fe0090] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30"
            >
                Retour à l'accueil
            </Link>
        </div>
    );
}
