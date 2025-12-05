'use client';

import { User, MapPin, AlertCircle } from 'lucide-react';

interface OrderSidebarProps {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
    } | null;
    guestEmail: string | null;
    shippingAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string | null;
    } | null;
}

export function OrderSidebar({ user, guestEmail, shippingAddress }: OrderSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#3f4c53] mb-4 flex items-center gap-2">
                    <User size={20} />
                    Client
                </h2>
                {user ? (
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Nom</p>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        {user.phone && (
                            <div>
                                <p className="text-sm text-gray-500">Téléphone</p>
                                <p className="font-medium">{user.phone}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-500">Email (Invité)</p>
                        <p className="font-medium">{guestEmail}</p>
                    </div>
                )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#3f4c53] mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Livraison
                </h2>
                {shippingAddress ? (
                    <div className="space-y-1">
                        <p className="font-medium">{shippingAddress.street}</p>
                        <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                        <p>{shippingAddress.country}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                        <AlertCircle size={20} />
                        <p className="text-sm">Adresse non renseignée</p>
                    </div>
                )}
            </div>
        </div>
    );
}
