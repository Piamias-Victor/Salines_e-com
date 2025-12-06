const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding SVR brand...');

    // 1. Create Brand
    const brand = await prisma.brand.upsert({
        where: { slug: 'svr' },
        update: {},
        create: {
            name: 'SVR',
            slug: 'svr',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Logo_Laboratoire_SVR.png/640px-Logo_Laboratoire_SVR.png',
            isActive: true,
            position: 1,
        },
    });

    console.log('Brand created:', brand.name);

    // 2. Create Categories
    const catVisage = await prisma.category.upsert({
        where: { slug: 'soins-visage' },
        update: {},
        create: {
            name: 'Soins Visage',
            slug: 'soins-visage',
            isActive: true,
        },
    });

    const catCorps = await prisma.category.upsert({
        where: { slug: 'soins-corps' },
        update: {},
        create: {
            name: 'Soins Corps',
            slug: 'soins-corps',
            isActive: true,
        },
    });

    // 3. Create Products
    const products = [
        {
            name: 'SVR Sebiaclear Gel Moussant 400ml',
            slug: 'svr-sebiaclear-gel-moussant-400ml',
            ean: '3401360015722',
            priceHT: 10.00,
            priceTTC: 12.00,
            tva: 20.00,
            stock: 50,
            imageUrl: 'https://www.easypara.fr/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/v/svr_sebiaclear_gel_moussant_400ml.jpg',
            categories: [catVisage.id, catCorps.id],
        },
        {
            name: 'SVR Topialyse Huile Lavante 1L',
            slug: 'svr-topialyse-huile-lavante-1l',
            ean: '3662361001194',
            priceHT: 15.00,
            priceTTC: 18.00,
            tva: 20.00,
            stock: 30,
            imageUrl: 'https://www.easypara.fr/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/v/svr_topialyse_huile_lavante_1l_eco_recharge.jpg',
            categories: [catCorps.id],
        },
        {
            name: 'SVR Sun Secure Blur SPF50+ 50ml',
            slug: 'svr-sun-secure-blur-spf50-50ml',
            ean: '3662361002566',
            priceHT: 12.50,
            priceTTC: 15.00,
            tva: 20.00,
            stock: 20,
            imageUrl: 'https://www.easypara.fr/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/v/svr_sun_secure_blur_spf50_50ml.jpg',
            categories: [catVisage.id],
        },
        {
            name: 'SVR Clairial Serum 30ml',
            slug: 'svr-clairial-serum-30ml',
            ean: '3401360226876',
            priceHT: 25.00,
            priceTTC: 30.00,
            tva: 20.00,
            stock: 10,
            imageUrl: 'https://www.easypara.fr/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/v/svr_clairial_serum_30ml.jpg',
            categories: [catVisage.id],
        }
    ];

    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { ean: p.ean },
            update: {
                brands: {
                    deleteMany: {},
                    create: { brandId: brand.id }
                },
                categories: {
                    deleteMany: {},
                    create: p.categories.map(cid => ({ categoryId: cid }))
                }
            },
            create: {
                name: p.name,
                slug: p.slug,
                ean: p.ean,
                priceHT: p.priceHT,
                priceTTC: p.priceTTC,
                tva: p.tva,
                stock: p.stock,
                imageUrl: p.imageUrl,
                brands: {
                    create: { brandId: brand.id }
                },
                categories: {
                    create: p.categories.map(cid => ({ categoryId: cid }))
                }
            },
        });
        console.log('Product upserted:', product.name);
    }

    console.log('Seeding completed.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
