'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, ShoppingBag, Loader2, Share2, Copy, Check } from 'lucide-react';
import { ProductCard } from '@/components/molecules/ProductCard';
import { toast } from 'sonner';

export default function WishlistPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { wishlistItems, isLoading: wishlistLoading } = useWishlist();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (!user) return;

            try {
                const response = await fetch('/api/user/wishlist', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.wishlistItems.map((item: any) => item.product));
                }
            } catch (error) {
                console.error('Failed to fetch wishlist products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWishlistProducts();
        }
    }, [user, wishlistItems]); // Re-fetch when wishlistItems changes (e.g. removed item)

    const handleShare = () => {
        if (!user) return;
        const url = `${window.location.origin}/wishlist/${user.id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Lien copié dans le presse-papier');
        setTimeout(() => setCopied(false), 2000);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#fe0090]" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <Link
                            href="/account"
                            className="text-gray-500 hover:text-[#fe0090] transition-colors mb-4 inline-flex items-center gap-2"
                        >
                            <ChevronRight className="rotate-180" size={16} />
                            Retour à mon compte
                        </Link>
                        <h1 className="text-3xl font-bold text-[#3f4c53] flex items-center gap-3">
                            <Heart className="text-[#fe0090]" />
                            Ma liste de souhaits
                        </h1>
                    </div>

                    {products.length > 0 && (
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-[#fe0090] hover:text-[#fe0090] transition-colors shadow-sm"
                        >
                            {copied ? <Check size={18} /> : <Share2 size={18} />}
                            <span>Partager ma liste</span>
                        </button>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Votre liste de souhaits est vide
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Sauvegardez vos produits préférés pour les retrouver plus tard.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#fe0090] hover:bg-[#fe0090]/90 transition-colors"
                        >
                            Découvrir nos produits
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
