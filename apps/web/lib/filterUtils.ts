// Filter utility functions for category product listing

export interface FilterParams {
    minPrice?: string;
    maxPrice?: string;
    brands?: string;
    inStock?: string;
    onlyPromo?: string;
    sort?: string;
    page?: string;
}

export function buildProductWhereClause(categoryId: string, params: FilterParams) {
    const where: any = {
        isActive: true,
        categories: {
            some: { categoryId },
        },
    };

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

    // Brand filter
    if (params.brands) {
        const brandIds = params.brands.split(',').filter(Boolean);
        if (brandIds.length > 0) {
            where.brands = {
                some: {
                    brandId: { in: brandIds },
                },
            };
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
