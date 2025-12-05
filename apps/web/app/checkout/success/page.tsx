'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Loader2, AlertCircle } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

    useEffect(() => {
        const paymentIntentId = searchParams.get('payment_intent');

        if (!paymentIntentId) {
            // No payment intent, redirect to home
            setTimeout(() => router.push('/'), 2000);
        } else {
            setPaymentIntent(paymentIntentId);
        }

        setLoading(false);
    }, [searchParams, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#fe0090]" size={48} />
            </div>
        );
    }

    if (!paymentIntent) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md text-center">
                    <AlertCircle className="mx-auto mb-4 text-yellow-500" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande trouvée</h1>
                    <p className="text-gray-600 mb-6">Redirection vers l'accueil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-0 pb-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">
                        Paiement réussi ! 🎉
                    </h1>
                    <p className="text-gray-600">
                        Votre commande a été confirmée et sera traitée dans les plus brefs délais
                    </p>
                </div>

                {/* Order Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#fe0090]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="text-[#fe0090]" size={24} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                Que se passe-t-il maintenant ?
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#fe0090]">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Confirmation de commande</p>
                                <p className="text-sm text-gray-600">Email envoyé avec les détails</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#fe0090]">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Préparation</p>
                                <p className="text-sm text-gray-600">Votre commande est en cours de préparation</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#fe0090]">
                                3
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Expédition</p>
                                <p className="text-sm text-gray-600">Vous recevrez un email avec le numéro de suivi</p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/account/orders"
                        className="flex-1 bg-[#fe0090] text-white font-semibold py-4 px-6 rounded-xl hover:bg-[#e0007f] transition-colors text-center"
                    >
                        Voir mes commandes
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 bg-white text-[#3f4c53] font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-[#fe0090] transition-colors text-center"
                    >
                        Continuer mes achats
                    </Link>
                </div>

                {/* Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Une question ? Contactez notre{' '}
                        <Link href="/contact" className="text-[#fe0090] hover:underline font-medium">
                            service client
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#fe0090]" size={48} />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
