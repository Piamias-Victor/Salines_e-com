'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Edit2, Trash2, Loader2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { AddressForm } from '@/components/molecules/AddressForm';
import { toast } from 'sonner';

interface Address {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
    isBilling: boolean;
    isShipping: boolean;
}

export default function AddressesPage() {
    const { user, accessToken, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    const fetchAddresses = async () => {
        try {
            const response = await fetch('/api/user/addresses', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Impossible de charger vos adresses');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && accessToken) {
            fetchAddresses();
        }
    }, [user, accessToken]);

    const handleSaveAddress = async (data: any) => {
        try {
            const url = editingAddress
                ? `/api/user/addresses/${editingAddress.id}`
                : '/api/user/addresses';

            const method = editingAddress ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

            toast.success(editingAddress ? 'Adresse modifiée' : 'Adresse ajoutée');
            setIsFormOpen(false);
            setEditingAddress(undefined);
            fetchAddresses();
        } catch (error) {
            toast.error('Une erreur est survenue');
            console.error(error);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return;

        try {
            const response = await fetch(`/api/user/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');

            toast.success('Adresse supprimée');
            fetchAddresses();
        } catch (error) {
            toast.error('Impossible de supprimer l\'adresse');
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#fe0090]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#fe0090] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Retour au compte</span>
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">Mes adresses</h1>
                        <p className="text-gray-500">Gérez vos adresses de livraison et facturation</p>
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={() => {
                                setEditingAddress(undefined);
                                setIsFormOpen(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-[#fe0090] text-white rounded-xl hover:bg-[#d4007a] transition-colors shadow-lg shadow-pink-500/30"
                        >
                            <Plus size={20} />
                            <span className="font-bold">Nouvelle adresse</span>
                        </button>
                    )}
                </div>

                {isFormOpen ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
                        </h2>
                        <AddressForm
                            initialData={editingAddress}
                            onSubmit={handleSaveAddress}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setEditingAddress(undefined);
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`bg-white rounded-2xl p-6 border-2 transition-all ${address.isDefault
                                        ? 'border-[#fe0090] shadow-md'
                                        : 'border-gray-100 shadow-sm hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${address.isDefault ? 'bg-pink-50 text-[#fe0090]' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            <MapPin size={20} />
                                        </div>
                                        {address.isDefault && (
                                            <span className="px-3 py-1 bg-pink-50 text-[#fe0090] text-xs font-bold rounded-full">
                                                Par défaut
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingAddress(address);
                                                setIsFormOpen(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 text-gray-600">
                                    <p className="font-bold text-gray-900">
                                        {address.firstName} {address.lastName}
                                    </p>
                                    {address.company && <p>{address.company}</p>}
                                    <p>{address.addressLine1}</p>
                                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                                    <p>{address.postalCode} {address.city}</p>
                                    <p>{address.country}</p>
                                    <p className="pt-2 flex items-center gap-2 text-sm text-gray-500">
                                        <span>📞</span> {address.phone}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {addresses.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <MapPin size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune adresse</h3>
                                <p className="text-gray-500 mb-6">Ajoutez une adresse pour faciliter vos commandes</p>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <Plus size={20} />
                                    <span>Ajouter une adresse</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
