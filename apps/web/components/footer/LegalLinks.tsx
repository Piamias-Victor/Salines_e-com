import Link from 'next/link';

const links = [
    { href: '/cgv', label: 'CGV' },
    { href: '/cookies', label: 'Gestion des cookies' },
    { href: '/privacy', label: 'Données personnelles' },
    { href: '/legal', label: 'Mentions légales' },
    { href: '/cookie-policy', label: 'Politique des cookies' },
    { href: '/accessibility', label: "Déclaration d'accessibilité" },
];

export function LegalLinks() {
    return (
        <div className="border-t border-gray-300 pt-8">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm mb-6">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-gray-600 hover:text-[#FE0090] transition-colors font-medium"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">
                    Fait avec 💖 en Corse 🏝️
                </p>
                <p className="text-gray-500 text-xs mt-2">
                    © {new Date().getFullYear()} Salines Parapharmacie. Tous droits réservés.
                </p>
            </div>
        </div>
    );
}
