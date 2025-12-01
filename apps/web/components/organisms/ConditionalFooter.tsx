'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ConditionalFooter() {
    const pathname = usePathname();

    // Don't show footer on dashboard or admin pages
    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
        return null;
    }

    return <Footer />;
}
