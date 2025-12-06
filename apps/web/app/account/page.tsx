'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { User, Package, Heart, MapPin, Settings, LogOut, Loader2 } from 'lucide-react';

export default function AccountPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#fe0090]" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const menuItems = [
        {
            icon: User,
            title: 'Mon profil',
            description: 'Gérer mes informations personnelles',
            href: '/account/profile',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            icon: Package,
            title: 'Mes commandes',
            description: 'Suivre mes commandes et historique',
            href: '/account/orders',
            color: 'bg-green-50 text-green-600',
        },
        {
            icon: Heart,
            title: 'Ma liste de souhaits',
            description: 'Produits sauvegardés',
            href: '/account/wishlist',
            color: 'bg-pink-50 text-pink-600',
        },
        {
            icon: MapPin,
            title: 'Mes adresses',
            description: 'Gérer mes adresses de livraison',
            href: '/account/addresses',
            color: 'bg-purple-50 text-purple-600',
        },

    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">
                                Bonjour, {user.firstName} !
                            </h1>
                            <p className="text-gray-500">
                                Bienvenue dans votre espace personnel
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-[#fe0090] transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <item.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#3f4c53] mb-1 group-hover:text-[#fe0090] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <p className="text-gray-500 mb-2">Commandes</p>
                        <p className="text-3xl font-bold text-[#3f4c53]">0</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <p className="text-gray-500 mb-2">Liste de souhaits</p>
                        <p className="text-3xl font-bold text-[#3f4c53]">0</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <p className="text-gray-500 mb-2">Adresses</p>
                        <p className="text-3xl font-bold text-[#3f4c53]">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
