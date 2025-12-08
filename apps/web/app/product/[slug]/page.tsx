import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductImageGallery } from '@/components/molecules/ProductImageGallery';
import { AddToCartSection } from '@/components/molecules/AddToCartSection';
import { Breadcrumb } from '@/components/molecules/Breadcrumb';
import { ProductInfoTabs } from '@/components/product/ProductInfoTabs';
import { MedicationBadge } from '@/components/product/MedicationBadge';
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

                            {product.isMedicament && (
                                <div className="inline-block ml-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-full">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                        MÉDICAMENT
                                    </span>
                                </div>
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
                                promotions: product.promotions,
                            }}
                            unitPrice={unitPrice}
                        />

                        {/* Medication Badge */}
                        {product.isMedicament && (
                            <MedicationBadge
                                maxOrderQuantity={product.maxOrderQuantity}
                                notice={product.notice}
                            />
                        )}
                    </div>
                </div>

                {/* Product Information Tabs */}
                <div className="mt-12 px-4 md:px-0">
                    <ProductInfoTabs
                        description={product.description}
                        composition={product.composition}
                        usageTips={product.usageTips}
                    />
                </div>
            </div>
        </div>
    );
}
