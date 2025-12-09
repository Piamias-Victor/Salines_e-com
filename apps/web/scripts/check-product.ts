import { PrismaClient } from '@prisma/client';

const salines = new PrismaClient();

async function checkProduct() {
    const ean = '3400941533969';

    console.log(`🔍 Vérification produit EAN: ${ean}\n`);

    const product = await salines.product.findFirst({
        where: { ean },
        include: {
            images: {
                orderBy: { position: 'asc' }
            },
            brands: {
                include: { brand: true }
            },
            categories: {
                include: { category: true }
            }
        }
    });

    if (!product) {
        console.log('❌ Produit NON trouvé dans Base Salines');
        await salines.$disconnect();
        return;
    }

    console.log('✅ Produit TROUVÉ dans Base Salines:\n');
    console.log(`ID: ${product.id}`);
    console.log(`Nom: ${product.name}`);
    console.log(`EAN: ${product.ean}`);
    console.log(`Slug: ${product.slug}`);
    console.log(`Prix HT: ${product.priceHT}`);
    console.log(`Prix TTC: ${product.priceTTC}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Actif: ${product.isActive}`);
    console.log(`\nDescription: ${product.description?.substring(0, 200)}...`);
    console.log(`\nComposition: ${product.composition?.substring(0, 200)}...`);
    console.log(`\nInstructions: ${product.usageTips?.substring(0, 200)}...`);

    console.log(`\n📸 Images (${product.images.length}):`);
    product.images.forEach((img, idx) => {
        console.log(`   ${idx + 1}. ${img.url}`);
    });

    console.log(`\n🏷️  Marques (${product.brands.length}):`);
    product.brands.forEach(b => {
        console.log(`   - ${b.brand.name}`);
    });

    console.log(`\n📁 Catégories (${product.categories.length}):`);
    product.categories.forEach(c => {
        console.log(`   - ${c.category.name}`);
    });

    console.log(`\n🌐 URL produit: http://localhost:3000/product/${product.slug}`);

    await salines.$disconnect();
}

checkProduct();
