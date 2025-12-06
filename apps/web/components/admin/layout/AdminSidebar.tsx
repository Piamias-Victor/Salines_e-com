'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Tag,
    Percent,
    Image as ImageIcon,
    ShoppingCart,
    ShoppingBag,
    Users,
    LogOut,
    Eye,
    Settings,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Produits', href: '/dashboard/products', icon: Package },
    { name: 'Catégories', href: '/dashboard/categories', icon: FolderTree },
    { name: 'Marques', href: '/dashboard/brands', icon: Tag },
    { name: 'Promotions', href: '/dashboard/promotions', icon: Percent },
    { name: 'Paniers', href: '/dashboard/carts', icon: ShoppingCart },
    { name: 'Bannières', href: '/dashboard/banners', icon: ImageIcon },
    { name: 'Vitrine', href: '/dashboard/showcase', icon: Eye },
    { name: 'Commandes', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Clients', href: '/dashboard/users', icon: Users },
    { name: 'Paramètres', href: '/dashboard/settings/delivery', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-[#2c4651] text-white">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-white/60 mt-1">Pharmacie des Salines</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                                isActive
                                    ? 'bg-[#fe0090] text-white shadow-lg'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </div>
    );
}
