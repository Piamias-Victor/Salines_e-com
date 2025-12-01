'use client';

import Link from 'next/link';

export function PromoBanner() {
    return (
        <div className="bg-[#fe0090] py-3 md:py-2.5 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                {/* Texte promotionnel */}
                <p className="text-white text-base md:text-lg font-extrabold uppercase tracking-wide drop-shadow-lg text-center md:text-left">
                    Des idées cadeaux à petit prix avec le Black Friday
                </p>

                {/* Bouton CTA - Larger on mobile */}
                <Link
                    href="/promotions/black-friday"
                    className="bg-[#fef000] text-[#fe0090] px-10 py-3.5 md:px-8 md:py-2.5 rounded-xl md:rounded-lg text-base font-black uppercase tracking-wider shadow-xl hover:shadow-2xl active:scale-95 transform transition-all duration-300 border-2 border-white w-full md:w-auto text-center"
                >
                    Je fonce
                </Link>
            </div>
        </div>
    );
}
