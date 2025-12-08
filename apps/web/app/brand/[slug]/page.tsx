import { CategoryBreadcrumb } from '@/components/category/CategoryBreadcrumb';
import { MobileHeader } from '@/components/category/MobileHeader';
import { DesktopHeader } from '@/components/category/DesktopHeader';
import { BrandFiltersSidebar } from '@/components/brand/BrandFiltersSidebar';
import { ProductsGrid } from '@/components/category/ProductsGrid';
import { Pagination } from '@/components/molecules/Pagination';
import { ActiveFilters } from '@/components/category/ActiveFilters';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { buildProductWhereClause, buildProductOrderBy, serializeProduct, getActiveFiltersCount } from '@/lib/filterUtils';

interface BrandPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        page?: string;
        sort?: string;
        minPrice?: string;
        maxPrice?: string;
        categories?: string;
        inStock?: string;
        onlyPromo?: string;
    }>;
}

export async function generateMetadata({ params }: BrandPageProps) {
    const { slug } = await params;
    const brand = await prisma.brand.findUnique({
        where: { slug, isActive: true },
    });

    if (!brand) return { title: 'Marque non trouvée' };

    return {
        title: `${brand.name} - Pharmacie des Salines`,
        description: `Découvrez tous les produits de la marque ${brand.name}`,
    };
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
    const { slug } = await params;
    const search = await searchParams;

    const page = parseInt(search.page || '1');
    const perPage = 24;
    const skip = (page - 1) * perPage;

    // Fetch brand
    const brand = await prisma.brand.findUnique({
        where: { slug, isActive: true },
    });

    if (!brand) notFound();

    // Build filters
    const where = buildProductWhereClause(search, { brandId: brand.id });
    const orderBy = buildProductOrderBy(search.sort);

    // Fetch products
    const [productsRaw, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                images: { orderBy: { position: 'asc' }, take: 1 },
                brands: { include: { brand: true } },
                promotions: {
                    include: { promotion: true },
                },
            },
            orderBy,
            take: perPage,
            skip,
        }),
        prisma.product.count({ where }),
    ]);

    // Serialize products
    const products = productsRaw.map(serializeProduct);

    // Fetch all categories for filters (categories that have products of this brand)
    const categories = await prisma.category.findMany({
        where: {
            isActive: true,
            products: {
                some: {
                    product: {
                        brands: {
                            some: { brandId: brand.id },
                        },
                    },
                },
            },
        },
        orderBy: { name: 'asc' },
    });

    const totalPages = Math.ceil(totalCount / perPage);
    const activeFiltersCount = getActiveFiltersCount(search);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <CategoryBreadcrumb
                        items={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Marques', href: '/brands' }, // Assuming there is a brands listing page, or just link to home
                            { label: brand.name, href: `/brand/${brand.slug}` },
                        ]}
                    />
                </div>
            </div>

            {/* Mobile Header - Not Sticky */}
            <div className="lg:hidden bg-white border-b">
                <MobileHeader
                    categoryName={brand.name}
                    totalProducts={totalCount}
                    currentSort={search.sort || 'relevance'}
                    activeFiltersCount={activeFiltersCount}
                    categories={categories}
                    currentFilters={{
                        minPrice: search.minPrice,
                        maxPrice: search.maxPrice,
                        brands: [],
                        categories: search.categories?.split(',').filter(Boolean) || [],
                        inStock: search.inStock === 'true',
                        onlyPromo: search.onlyPromo === 'true',
                    }}
                />
            </div>

            {/* Desktop Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Desktop Sidebar - Sticky */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-6">
                            <BrandFiltersSidebar
                                categories={categories}
                                currentFilters={{
                                    minPrice: search.minPrice,
                                    maxPrice: search.maxPrice,
                                    categories: search.categories?.split(',').filter(Boolean) || [],
                                    inStock: search.inStock === 'true',
                                    onlyPromo: search.onlyPromo === 'true',
                                }}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        {/* Desktop Header */}
                        <div className="hidden lg:block mb-6">
                            <DesktopHeader
                                categoryName={brand.name}
                                totalProducts={totalCount}
                                currentSort={search.sort || 'relevance'}
                            />
                        </div>

                        {/* Brand Description - Desktop */}
                        {brand.description && (
                            <div className="hidden lg:block bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-100">
                                <div className="prose max-w-none text-gray-600">
                                    {brand.description.split('\n').map((paragraph: string, index: number) => (
                                        <p key={index} className="mb-4 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="mb-6">
                                <ActiveFilters
                                    filters={{
                                        minPrice: search.minPrice,
                                        maxPrice: search.maxPrice,
                                        brands: [], // No brand filter display
                                        inStock: search.inStock === 'true',
                                        onlyPromo: search.onlyPromo === 'true',
                                    }}
                                    brandsList={[]}
                                />
                            </div>
                        )}

                        {/* Products Grid */}
                        <ProductsGrid products={products as any} />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    baseUrl={`/brand/${brand.slug}`}
                                />
                            </div>
                        )}

                        {/* Brand Description - Mobile */}
                        {brand.description && (
                            <div className="lg:hidden mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <div className="prose max-w-none text-gray-600">
                                    {brand.description.split('\n').map((paragraph: string, index: number) => (
                                        <p key={index} className="mb-4 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
