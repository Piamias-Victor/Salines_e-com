'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/molecules/ProductCard';
import { useParams } from 'next/navigation';

export default function SharedWishlistPage() {
    const params = useParams();
    const userId = params.userId as string;

    const [products, setProducts] = useState<any[]>([]);
    const [ownerName, setOwnerName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch(`/api/wishlist/${userId}`);

                if (!response.ok) {
                    throw new Error('Impossible de charger la liste');
                }

                const data = await response.json();
                setProducts(data.wishlistItems.map((item: any) => item.product));
                setOwnerName(data.ownerName);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchWishlist();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#fe0090]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Oups !</h1>
                    <p className="text-gray-500">{error}</p>
                    <Link href="/" className="mt-4 inline-block text-[#fe0090] hover:underline">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#3f4c53] flex items-center justify-center gap-3 mb-2">
                        <Heart className="text-[#fe0090]" fill="#fe0090" />
                        Liste de souhaits de {ownerName}
                    </h1>
                    <p className="text-gray-500">
                        Découvrez les produits favoris de {ownerName}
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Cette liste est vide
                        </h2>
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
