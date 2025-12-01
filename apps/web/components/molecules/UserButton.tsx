'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function UserButton() {
    const { user } = useAuth();

    return (
        <Link
            href={user ? '/account' : '/auth/login'}
            className="w-10 h-10 flex items-center justify-center text-[#3f4c53] hover:text-[#fe0090] hover:bg-pink-50 rounded-lg transition-all duration-200"
            aria-label={user ? 'Mon compte' : 'Se connecter'}
        >
            <User size={22} />
        </Link>
    );
}
