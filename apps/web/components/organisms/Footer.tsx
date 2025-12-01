'use client';

import { NewsletterSection } from '@/components/footer/NewsletterSection';
import { SocialMediaSection } from '@/components/footer/SocialMediaSection';
import { LegalLinks } from '@/components/footer/LegalLinks';

export function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <NewsletterSection />
                    <SocialMediaSection />
                </div>
                <LegalLinks />
            </div>
        </footer>
    );
}
