'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Lien de vérification invalide.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/auth/verify?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Une erreur est survenue.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Erreur de connexion.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="mx-auto h-12 w-12 text-[#fe0090] animate-spin" />
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Vérification en cours...</h2>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Email vérifié !</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/auth/login"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe0090] hover:bg-[#d4007a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe0090]"
                                >
                                    Se connecter
                                </Link>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="mx-auto h-16 w-16 text-red-500" />
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Échec de la vérification</h2>
                            <p className="mt-2 text-sm text-gray-600">{message}</p>
                            <div className="mt-6">
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-[#fe0090] hover:text-[#d4007a]"
                                >
                                    Retour à l'accueil
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#fe0090]" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}
