'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
    { name: 'Livraison', href: '/dashboard/settings/delivery', icon: Truck },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#3f4c53]">Paramètres</h1>
                <p className="text-gray-500">Gérez les configurations de votre boutique.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href;

                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm gap-2',
                                    isActive
                                        ? 'border-[#fe0090] text-[#fe0090]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                )}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon
                                    className={cn(
                                        '-ml-0.5 mr-2 h-5 w-5',
                                        isActive ? 'text-[#fe0090]' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {children}
        </div>
    );
}
