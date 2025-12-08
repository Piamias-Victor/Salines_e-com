import { prisma } from '../lib/prisma';

async function debugProduct() {
    const slug = 'doliprane-1-000mg-gelule-8-3969';

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: {
                orderBy: { position: 'asc' },
            },
            brands: {
                include: { brand: true },
            },
        },
    });

    console.log('🔍 Debug produit:', slug);
    console.log('\n📦 Produit:', {
        id: product?.id,
        name: product?.name,
        imageUrl: product?.imageUrl,
    });
    console.log('\n📸 Images (' + (product?.images.length || 0) + '):');
    product?.images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.url}`);
    });

    console.log('\n🎨 Component recevra:');
    console.log('  - images:', product?.images.map(i => ({ id: i.id, url: i.url })));
    console.log('  - mainImage:', product?.imageUrl);

    await prisma.$disconnect();
}

debugProduct();
