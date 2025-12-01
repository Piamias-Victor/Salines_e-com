import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductImageGallery } from '@/components/molecules/ProductImageGallery';
import { AddToCartSection } from '@/components/molecules/AddToCartSection';
import { Breadcrumb } from '@/components/molecules/Breadcrumb';
import { getProductBySlug } from '@/lib/data/products';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

// ============================================================================
// Product Page (Server Component)
// ============================================================================

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const brand = product.brands[0]?.brand;

    // Calculate unit price
    let unitPrice = null;
    if (product.weight && Number(product.weight) > 0) {
        const price = Number(product.priceTTC);
        const weight = Number(product.weight);
        const pricePerUnit = price / weight;
        unitPrice = `${pricePerUnit.toFixed(2)} € / kg`;
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-32 md:pb-12">
            <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8 py-4 md:py-8">
                {/* Breadcrumb */}
                <Breadcrumb product={product} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Product Image (5 cols) */}
                    <div className="lg:col-span-5 px-4 md:px-0">
                        <ProductImageGallery
                            images={product.images}
                            mainImage={product.imageUrl}
                            productName={product.name}
                        />
                    </div>

                    {/* Right: Product Info (7 cols) */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8 px-4 md:px-0">
                        {/* Header Info */}
                        <div className="space-y-2 md:space-y-4">
                            {brand && (
                                <Link
                                    href={`/brand/${brand.slug}`}
                                    className="inline-block text-sm font-bold text-[#fe0090] uppercase tracking-wider hover:underline"
                                >
                                    {brand.name}
                                </Link>
                            )}

                            <h1 className="text-2xl md:text-4xl font-extrabold text-[#3f4c53] leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        {/* Actions Section */}
                        <AddToCartSection
                            product={{
                                id: product.id,
                                priceTTC: Number(product.priceTTC),
                                stock: product.stock,
                                maxOrderQuantity: product.maxOrderQuantity,
                            }}
                            unitPrice={unitPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

