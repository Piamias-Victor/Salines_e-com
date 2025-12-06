// Filter utility functions for category product listing

export interface FilterParams {
    minPrice?: string;
    maxPrice?: string;
    brands?: string;
    categories?: string;
    inStock?: string;
    onlyPromo?: string;
    sort?: string;
    page?: string;
}

interface ProductScope {
    categoryId?: string;
    brandId?: string;
}

export function buildProductWhereClause(params: FilterParams, scope: ProductScope = {}) {
    const where: any = {
        isActive: true,
    };

    // Apply scope
    if (scope.categoryId) {
        where.categories = {
            some: { categoryId: scope.categoryId },
        };
    }

    if (scope.brandId) {
        where.brands = {
            some: { brandId: scope.brandId },
        };
    }

    // Price filters
    if (params.minPrice || params.maxPrice) {
        where.priceTTC = {};
        if (params.minPrice) {
            where.priceTTC.gte = parseFloat(params.minPrice);
        }
        if (params.maxPrice) {
            where.priceTTC.lte = parseFloat(params.maxPrice);
        }
    }

    // Stock filter
    if (params.inStock === 'true') {
        where.stock = { gt: 0 };
    }

    // Brand filter (for Category page)
    if (params.brands) {
        const brandIds = params.brands.split(',').filter(Boolean);
        if (brandIds.length > 0) {
            // If we already have a brand scope, this is redundant or conflicting, but usually we don't mix.
            // If we are in a Category page (scope.categoryId), we filter by brands.
            where.brands = {
                some: {
                    brandId: { in: brandIds },
                },
            };
        }
    }

    // Category filter (for Brand page)
    if (params.categories) {
        const categoryIds = params.categories.split(',').filter(Boolean);
        if (categoryIds.length > 0) {
            // If we are in a Brand page (scope.brandId), we filter by categories.
            // We need to handle the case where we might already have a category scope (unlikely for Brand page).
            if (where.categories) {
                // If scope.categoryId exists, we need AND logic
                where.AND = [
                    { categories: where.categories },
                    { categories: { some: { categoryId: { in: categoryIds } } } }
                ];
                delete where.categories;
            } else {
                where.categories = {
                    some: {
                        categoryId: { in: categoryIds },
                    },
                };
            }
        }
    }

    // Promotions filter
    if (params.onlyPromo === 'true') {
        where.promotions = {
            some: {},
        };
    }

    return where;
}

export function buildProductOrderBy(sort?: string) {
    switch (sort) {
        case 'price-asc':
            return { priceTTC: 'asc' as const };
        case 'price-desc':
            return { priceTTC: 'desc' as const };
        case 'name-asc':
            return { name: 'asc' as const };
        case 'newest':
            return { createdAt: 'desc' as const };
        case 'promotions':
            // Products with promotions first, then by position
            return [
                { promotions: { _count: 'desc' as const } },
                { position: 'asc' as const },
            ];
        default: // 'relevance'
            return { position: 'asc' as const };
    }
}

export function serializeProduct(product: any) {
    return {
        ...product,
        priceHT: Number(product.priceHT),
        priceTTC: Number(product.priceTTC),
        tva: Number(product.tva),
        weight: product.weight ? Number(product.weight) : null,
    };
}

export function getActiveFiltersCount(params: FilterParams): number {
    let count = 0;
    if (params.minPrice || params.maxPrice) count++;
    if (params.brands) count += params.brands.split(',').filter(Boolean).length;
    if (params.categories) count += params.categories.split(',').filter(Boolean).length;
    if (params.inStock === 'true') count++;
    if (params.onlyPromo === 'true') count++;
    return count;
}

export function buildFilterUrl(baseUrl: string, params: FilterParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            searchParams.set(key, value);
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
