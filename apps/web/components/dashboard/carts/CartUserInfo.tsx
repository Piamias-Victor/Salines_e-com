'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, Copy, Check, Truck } from 'lucide-react';

interface CartUserInfoProps {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        createdAt: string;
    } | null;
    sessionToken: string;
    shippingMethod: {
        id: string;
        name: string;
        description: string | null;
    } | null;
}

export function CartUserInfo({ user, sessionToken, shippingMethod }: CartUserInfoProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#3f4c53] mb-4 flex items-center gap-2">
                <User size={20} />
                {user ? 'Utilisateur' : 'Session Invité'}
            </h2>

            {user ? (
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Nom complet</p>
                        <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                            <Mail size={14} />
                            Email
                        </p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                    {user.phone && (
                        <div>
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                <Phone size={14} />
                                Téléphone
                            </p>
                            <p className="font-medium text-gray-900">{user.phone}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Membre depuis</p>
                        <p className="font-medium text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    <Link
                        href={`/dashboard/users/${user.id}`}
                        className="inline-block w-full text-center px-4 py-2 bg-[#fe0090] text-white rounded-lg hover:bg-[#d4007a] transition-colors"
                    >
                        Voir le profil
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Session Token</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-xs font-mono break-all">
                                {sessionToken}
                            </code>
                            <button
                                onClick={() => copyToClipboard(sessionToken)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors"
                                title="Copier"
                            >
                                {copied ? (
                                    <Check size={20} className="text-green-500" />
                                ) : (
                                    <Copy size={20} className="text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Panier d'un utilisateur non connecté
                        </p>
                    </div>
                </div>
            )}

            {/* Shipping Method */}
            {shippingMethod && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                        <Truck size={16} />
                        Méthode de livraison
                    </h3>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-medium text-blue-900">{shippingMethod.name}</p>
                        {shippingMethod.description && (
                            <p className="text-sm text-blue-700 mt-1">
                                {shippingMethod.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
