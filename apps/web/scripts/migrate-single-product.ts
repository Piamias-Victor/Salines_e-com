import { PrismaClient } from '@prisma/client';

const PHARDEV_URL = 'postgresql://phardev_owner:iUPZSl3ehC9T@ep-rapid-wave-a2o7mwyr-pooler.eu-central-1.aws.neon.tech/phardev?sslmode=require&channel_binding=require';
const SALINES_URL = process.env.DATABASE_URL!;

const phardev = new PrismaClient({ datasourceUrl: PHARDEV_URL });
const salines = new PrismaClient({ datasourceUrl: SALINES_URL });

const S3_BASE_URL = 'https://praden.s3.eu-west-3.amazonaws.com/public';

// Mappings (devront être chargés depuis les bases)
const categoryMapping = new Map<string, string>();
const laboratoryMapping = new Map<string, string>();

function buildImageUrl(type: 'products', hash: string | null): string | null {
    if (!hash) return null;
    return `${S3_BASE_URL}/${type}/${hash}`;
}

async function loadMappings() {
    console.log('📥 Chargement des mappings...\n');

    // Charger mapping catégories
    const categories = await salines.category.findMany({
        select: { id: true, slug: true }
    });

    // Charger toutes les catégories phardev pour retrouver les UUIDs
    const phardevCats = await phardev.$queryRaw<any[]>`
    SELECT uuid, name FROM categories
  `;

    for (const cat of phardevCats) {
        const salinesCat = categories.find(c =>
            c.slug.startsWith(cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        );
        if (salinesCat) {
            categoryMapping.set(cat.uuid, salinesCat.id);
        }
    }

    // Charger mapping laboratoires
    const brands = await salines.brand.findMany({
        select: { id: true, slug: true }
    });

    const phardevLabs = await phardev.$queryRaw<any[]>`
    SELECT uuid, name FROM laboratories
  `;

    for (const lab of phardevLabs) {
        const salinesBrand = brands.find(b =>
            b.slug.startsWith(lab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        );
        if (salinesBrand) {
            laboratoryMapping.set(lab.uuid, salinesBrand.id);
        }
    }

    console.log(`✅ ${categoryMapping.size} catégories mappées`);
    console.log(`✅ ${laboratoryMapping.size} laboratoires mappés\n`);
}

async function migrateProduct(ean: string) {
    console.log(`🚀 Migration du produit EAN: ${ean}\n`);

    // 1. Trouver le produit dans Salines
    const salinesProduct = await salines.product.findFirst({
        where: { ean },
        select: { id: true, name: true, ean: true }
    });

    if (!salinesProduct) {
        console.log('❌ Produit non trouvé dans Base Salines');
        return;
    }

    console.log(`📦 Produit Salines: ${salinesProduct.name}\n`);

    // 2. Trouver dans phardev
    const phardevProduct = await phardev.$queryRaw<any[]>`
    SELECT p.uuid, p.name, p.description, p.instructions_for_use, 
           p.composition, p.ean13, p.laboratory_uuid
    FROM products p
    WHERE p.ean13 = ${ean}
    LIMIT 1
  `;

    if (phardevProduct.length === 0) {
        console.log('❌ Produit non trouvé dans Base phardev');
        return;
    }

    const phardevData = phardevProduct[0];
    console.log(`📦 Produit phardev: ${phardevData.name}\n`);

    // 3. Mettre à jour les données de base
    await salines.product.update({
        where: { id: salinesProduct.id },
        data: {
            name: phardevData.name,
            description: phardevData.description,
            composition: phardevData.composition,
            usageTips: phardevData.instructions_for_use,
        }
    });
    console.log('✅ Données de base mises à jour');

    // 4. Associer le laboratoire
    if (phardevData.laboratory_uuid) {
        const brandId = laboratoryMapping.get(phardevData.laboratory_uuid);
        if (brandId) {
            await salines.productBrand.deleteMany({
                where: { productId: salinesProduct.id }
            });

            await salines.productBrand.create({
                data: {
                    productId: salinesProduct.id,
                    brandId: brandId,
                }
            });
            console.log('✅ Laboratoire associé');
        }
    }

    // 5. Associer les catégories
    const phardevProductCats = await phardev.$queryRaw<{ category_uuid: string }[]>`
    SELECT category_uuid
    FROM product_categories
    WHERE product_uuid = ${phardevData.uuid}
  `;

    if (phardevProductCats.length > 0) {
        await salines.productCategory.deleteMany({
            where: { productId: salinesProduct.id }
        });

        for (const pc of phardevProductCats) {
            const categoryId = categoryMapping.get(pc.category_uuid);
            if (categoryId) {
                await salines.productCategory.create({
                    data: {
                        productId: salinesProduct.id,
                        categoryId: categoryId,
                    }
                });
            }
        }
        console.log(`✅ ${phardevProductCats.length} catégories associées`);
    }

    // 6. Associer les images
    const phardevImages = await phardev.$queryRaw<{ image_hash: string; order: number }[]>`
    SELECT image_hash, "order"
    FROM product_images
    WHERE product_uuid = ${phardevData.uuid}
    ORDER BY "order"
  `;

    if (phardevImages.length > 0) {
        await salines.productImage.deleteMany({
            where: { productId: salinesProduct.id }
        });

        for (const img of phardevImages) {
            if (img.image_hash) {
                const imageUrl = buildImageUrl('products', img.image_hash)!;
                await salines.productImage.create({
                    data: {
                        productId: salinesProduct.id,
                        url: imageUrl,
                        position: img.order,
                    }
                });
                console.log(`   📸 Image ajoutée: ${imageUrl}`);
            }
        }
        console.log(`✅ ${phardevImages.length} images associées`);
    }

    console.log('\n🎉 Migration terminée !\n');

    // 7. Afficher le résultat
    const updatedProduct = await salines.product.findUnique({
        where: { id: salinesProduct.id },
        include: {
            images: { orderBy: { position: 'asc' } },
            brands: { include: { brand: true } },
            categories: { include: { category: true } }
        }
    });

    console.log('📋 Résultat final:\n');
    console.log(`Nom: ${updatedProduct!.name}`);
    console.log(`Description: ${updatedProduct!.description?.substring(0, 100)}...`);
    console.log(`Composition: ${updatedProduct!.composition?.substring(0, 100)}...`);
    console.log(`Instructions: ${updatedProduct!.usageTips?.substring(0, 100)}...`);
    console.log(`\nImages: ${updatedProduct!.images.length}`);
    updatedProduct!.images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.url}`);
    });
    console.log(`\nMarque: ${updatedProduct!.brands[0]?.brand.name || 'N/A'}`);
    console.log(`Catégories: ${updatedProduct!.categories.map(c => c.category.name).join(', ')}`);
    console.log(`\n🌐 Voir sur: http://localhost:3000/product/${updatedProduct!.slug}`);
}

async function main() {
    try {
        await loadMappings();
        await migrateProduct('3400941533969');
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await phardev.$disconnect();
        await salines.$disconnect();
    }
}

main();
