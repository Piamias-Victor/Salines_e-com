import { CategoryBreadcrumb } from '@/components/category/CategoryBreadcrumb';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { CategoryProductsSection } from '@/components/category/CategoryProductsSection';
import { SubcategoryShowcase } from '@/components/category/SubcategoryShowcase';
import { NewProductsSection } from '@/components/category/NewProductsSection';
import { PromotionsSection } from '@/components/category/PromotionsSection';
import { CategoryDescription } from '@/components/category/CategoryDescription';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { slug, isActive: true },
    });

    if (!category) return { title: 'Catégorie non trouvée' };

    return {
        title: `${category.name} - Pharmacie des Salines`,
        description: category.metaDescription || category.description,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    // Fetch category with subcategories
    const category = await prisma.category.findUnique({
        where: { slug, isActive: true },
        include: {
            children: {
                where: { isActive: true },
                orderBy: { position: 'asc' },
            },
        },
    });

    if (!category) notFound();

    // Fetch main category products (not from subcategories)
    const mainCategoryProductsRaw = await prisma.product.findMany({
        where: {
            isActive: true,
            categories: {
                some: { categoryId: category.id },
            },
        },
        include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            brands: { include: { brand: true } },
        },
        orderBy: { position: 'asc' },
        take: 5,
    });

    // Serialize products to fix Decimal issue
    const mainCategoryProducts = mainCategoryProductsRaw.map((p: any) => ({
        ...p,
        priceHT: Number(p.priceHT),
        priceTTC: Number(p.priceTTC),
        tva: Number(p.tva),
        weight: p.weight ? Number(p.weight) : null,
    }));

    // Fetch products for each subcategory (top 4)
    const subcategoriesWithProducts = await Promise.all(
        category.children.map(async (subcat: any) => {
            const productsRaw = await prisma.product.findMany({
                where: {
                    isActive: true,
                    categories: {
                        some: { categoryId: subcat.id },
                    },
                },
                include: {
                    images: { orderBy: { position: 'asc' }, take: 1 },
                    brands: { include: { brand: true } },
                },
                orderBy: { position: 'asc' },
                take: 4,
            });

            const products = productsRaw.map((p: any) => ({
                ...p,
                priceHT: Number(p.priceHT),
                priceTTC: Number(p.priceTTC),
                tva: Number(p.tva),
                weight: p.weight ? Number(p.weight) : null,
            }));

            return { subcategory: subcat, products };
        })
    );

    // Fetch new products (created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newProductsRaw = await prisma.product.findMany({
        where: {
            isActive: true,
            categories: {
                some: { categoryId: category.id },
            },
            createdAt: { gte: thirtyDaysAgo },
        },
        include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            brands: { include: { brand: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const newProducts = newProductsRaw.map((p: any) => ({
        ...p,
        priceHT: Number(p.priceHT),
        priceTTC: Number(p.priceTTC),
        tva: Number(p.tva),
        weight: p.weight ? Number(p.weight) : null,
    }));

    // Fetch products on promotion
    const promoProductsRaw = await prisma.product.findMany({
        where: {
            isActive: true,
            categories: {
                some: { categoryId: category.id },
            },
            promotions: {
                some: {},
            },
        },
        include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            brands: { include: { brand: true } },
            promotions: {
                include: {
                    promotion: true,
                },
            },
        },
        orderBy: { position: 'asc' },
        take: 5,
    });

    const promoProducts = promoProductsRaw.map((p: any) => ({
        ...p,
        priceHT: Number(p.priceHT),
        priceTTC: Number(p.priceTTC),
        tva: Number(p.tva),
        weight: p.weight ? Number(p.weight) : null,
    }));

    // Build content sections with interspersed subcategories
    const contentSections: Array<{
        type: string;
        data: any;
        reversed?: boolean;
    }> = [];

    // Add main category products first (always show)
    contentSections.push({
        type: 'main-products',
        data: mainCategoryProducts.length > 0 ? mainCategoryProducts : [],
    });

    // Intersperse subcategories with new products and promotions
    subcategoriesWithProducts.forEach((item, index) => {
        contentSections.push({
            type: 'subcategory',
            data: item,
            reversed: index % 2 !== 0, // Alternate layout
        });

        // Add new products after first subcategory (always show)
        if (index === 0) {
            contentSections.push({
                type: 'new-products',
                data: newProducts.length > 0 ? newProducts : [],
            });
        }

        // Add promotions after second subcategory (always show)
        if (index === 1) {
            contentSections.push({
                type: 'promotions',
                data: promoProducts.length > 0 ? promoProducts : [],
            });
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <CategoryBreadcrumb
                        items={[
                            { label: 'Accueil', href: '/' },
                            { label: category.name, href: `/category/${category.slug}` },
                        ]}
                    />
                </div>
            </div>

            {/* Category Header */}
            <CategoryHeader
                category={category}
                productCount={mainCategoryProducts.length}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Render content sections in order */}
                {contentSections.map((section, index) => {
                    if (section.type === 'main-products') {
                        return (
                            <CategoryProductsSection
                                key={`main-${index}`}
                                categoryName={category.name}
                                categorySlug={category.slug}
                                products={section.data as any}
                            />
                        );
                    }

                    if (section.type === 'subcategory') {
                        const { subcategory, products } = section.data as any;
                        return (
                            <SubcategoryShowcase
                                key={subcategory.id}
                                subcategory={subcategory}
                                products={products}
                                reversed={section.reversed}
                            />
                        );
                    }

                    if (section.type === 'new-products') {
                        return (
                            <NewProductsSection
                                key={`new-${index}`}
                                products={section.data as any}
                            />
                        );
                    }

                    if (section.type === 'promotions') {
                        return (
                            <PromotionsSection
                                key={`promo-${index}`}
                                products={section.data as any}
                            />
                        );
                    }

                    return null;
                })}

                {/* SEO Description */}
                {category.description && (
                    <CategoryDescription
                        categoryName={category.name}
                        description={category.description}
                    />
                )}
            </div>
        </div>
    );
}
