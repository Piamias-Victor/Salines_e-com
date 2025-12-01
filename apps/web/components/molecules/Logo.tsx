import Link from 'next/link';

export function Logo() {
    return (
        <Link href="/" className="text-xl font-bold text-[#3f4c53] hover:text-[#fe0090] transition-colors">
            Pharmacie des Salines
        </Link>
    );
}
