import { CategoryBreadcrumb } from '@/components/category/CategoryBreadcrumb';
import { MobileHeader } from '@/components/category/MobileHeader';
import { DesktopHeader } from '@/components/category/DesktopHeader';
import { DesktopFiltersSidebar } from '@/components/category/DesktopFiltersSidebar';
import { ProductsGrid } from '@/components/category/ProductsGrid';
import { Pagination } from '@/components/molecules/Pagination';
import { ActiveFilters } from '@/components/category/ActiveFilters';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { buildProductWhereClause, buildProductOrderBy, serializeProduct, getActiveFiltersCount } from '@/lib/filterUtils';

interface CategoryAllPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        page?: string;
        sort?: string;
        minPrice?: string;
        maxPrice?: string;
        brands?: string;
        inStock?: string;
        onlyPromo?: string;
    }>;
}

export async function generateMetadata({ params }: CategoryAllPageProps) {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { slug, isActive: true },
    });

    if (!category) return { title: 'Catégorie non trouvée' };

    return {
        title: `${category.name} - Tous les produits - Pharmacie des Salines`,
        description: category.metaDescription || `Découvrez tous les produits ${category.name}`,
    };
}

export default async function CategoryAllPage({ params, searchParams }: CategoryAllPageProps) {
    const { slug } = await params;
    const search = await searchParams;

    const page = parseInt(search.page || '1');
    const perPage = 24;
    const skip = (page - 1) * perPage;

    // Fetch category
    const category = await prisma.category.findUnique({
        where: { slug, isActive: true },
    });

    if (!category) notFound();

    // Build filters
    const where = buildProductWhereClause(category.id, search);
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

    // Fetch all brands for filters
    const brands = await prisma.brand.findMany({
        where: {
            isActive: true,
            products: {
                some: {
                    product: {
                        categories: {
                            some: { categoryId: category.id },
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
                            { label: category.name, href: `/category/${category.slug}` },
                            { label: 'Tous les produits', href: `/category/${category.slug}/all` },
                        ]}
                    />
                </div>
            </div>

            {/* Mobile Header - Not Sticky */}
            <div className="lg:hidden bg-white border-b">
                <MobileHeader
                    categoryName={category.name}
                    totalProducts={totalCount}
                    currentSort={search.sort || 'relevance'}
                    activeFiltersCount={activeFiltersCount}
                    brands={brands}
                    currentFilters={{
                        minPrice: search.minPrice,
                        maxPrice: search.maxPrice,
                        brands: search.brands?.split(',').filter(Boolean) || [],
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
                            <DesktopFiltersSidebar
                                brands={brands}
                                currentFilters={{
                                    minPrice: search.minPrice,
                                    maxPrice: search.maxPrice,
                                    brands: search.brands?.split(',').filter(Boolean) || [],
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
                                categoryName={category.name}
                                totalProducts={totalCount}
                                currentSort={search.sort || 'relevance'}
                            />
                        </div>

                        {/* Active Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="mb-6">
                                <ActiveFilters
                                    filters={{
                                        minPrice: search.minPrice,
                                        maxPrice: search.maxPrice,
                                        brands: search.brands?.split(',').filter(Boolean) || [],
                                        inStock: search.inStock === 'true',
                                        onlyPromo: search.onlyPromo === 'true',
                                    }}
                                    brandsList={brands}
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
                                    baseUrl={`/category/${category.slug}/all`}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
