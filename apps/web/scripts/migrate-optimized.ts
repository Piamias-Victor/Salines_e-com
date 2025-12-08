import { PrismaClient } from '@prisma/client';

const PHARDEV_URL = 'postgresql://phardev_owner:iUPZSl3ehC9T@ep-rapid-wave-a2o7mwyr-pooler.eu-central-1.aws.neon.tech/phardev?sslmode=require&channel_binding=require';
const SALINES_URL = process.env.DATABASE_URL!;

const phardev = new PrismaClient({ datasourceUrl: PHARDEV_URL });
const salines = new PrismaClient({ datasourceUrl: SALINES_URL });

const S3_BASE_URL = 'https://praden.s3.eu-west-3.amazonaws.com/public';
const BATCH_SIZE = 100;

// Mappings
const categoryMapping = new Map<string, string>();
const laboratoryMapping = new Map<string, string>();

function buildImageUrl(type: 'categories' | 'laboratories' | 'products', hash: string | null): string | null {
    if (!hash) return null;
    return `${S3_BASE_URL}/${type}/${hash}`;
}

async function loadMappings() {
    console.log('📥 Chargement des mappings...');

    const [categories, brands, phardevCats, phardevLabs] = await Promise.all([
        salines.category.findMany({ select: { id: true, slug: true } }),
        salines.brand.findMany({ select: { id: true, slug: true } }),
        phardev.$queryRaw<any[]>`SELECT uuid, name FROM categories`,
        phardev.$queryRaw<any[]>`SELECT uuid, name FROM laboratories`,
    ]);

    for (const cat of phardevCats) {
        const salinesCat = categories.find(c =>
            c.slug.startsWith(cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        );
        if (salinesCat) categoryMapping.set(cat.uuid, salinesCat.id);
    }

    for (const lab of phardevLabs) {
        const salinesBrand = brands.find(b =>
            b.slug.startsWith(lab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        );
        if (salinesBrand) laboratoryMapping.set(lab.uuid, salinesBrand.id);
    }

    console.log(`✅ ${categoryMapping.size} catégories mappées`);
    console.log(`✅ ${laboratoryMapping.size} laboratoires mappés\n`);
}

async function migrateProductsBatch() {
    console.log('🛒 === MIGRATION PRODUITS (OPTIMISÉE) ===\n');

    // 1. Charger TOUS les produits Salines avec EAN13
    console.log('📖 Chargement produits Salines...');
    const allProducts = await salines.product.findMany({
        select: { id: true, ean: true, name: true },
    });
    const salinesProducts = allProducts.filter(p => p.ean);
    console.log(`   ✓ ${salinesProducts.length} produits avec EAN13\n`);

    // 2. Charger TOUS les produits phardev en une fois
    console.log('📖 Chargement produits phardev...');
    const phardevProducts = await phardev.$queryRaw<any[]>`
    SELECT p.uuid, p.name, p.description, p.instructions_for_use, 
           p.composition, p.ean13, p.laboratory_uuid
    FROM products p
  `;

    // Créer un index par EAN13
    const phardevByEan = new Map(phardevProducts.map(p => [p.ean13, p]));
    console.log(`   ✓ ${phardevProducts.length} produits phardev en mémoire\n`);

    // 3. Charger toutes les images phardev
    console.log('📖 Chargement images phardev...');
    const phardevImages = await phardev.$queryRaw<any[]>`
    SELECT product_uuid, image_hash, "order"
    FROM product_images
    ORDER BY product_uuid, "order"
  `;

    const imagesByProduct = new Map<string, any[]>();
    for (const img of phardevImages) {
        if (!imagesByProduct.has(img.product_uuid)) {
            imagesByProduct.set(img.product_uuid, []);
        }
        imagesByProduct.get(img.product_uuid)!.push(img);
    }
    console.log(`   ✓ ${phardevImages.length} images en mémoire\n`);

    // 4. Charger toutes les catégories produits phardev
    console.log('📖 Chargement catégories produits phardev...');
    const phardevProductCats = await phardev.$queryRaw<any[]>`
    SELECT product_uuid, category_uuid
    FROM product_categories
  `;

    const categoriesByProduct = new Map<string, string[]>();
    for (const pc of phardevProductCats) {
        if (!categoriesByProduct.has(pc.product_uuid)) {
            categoriesByProduct.set(pc.product_uuid, []);
        }
        categoriesByProduct.get(pc.product_uuid)!.push(pc.category_uuid);
    }
    console.log(`   ✓ ${phardevProductCats.length} associations catégories en mémoire\n`);

    // 5. Traiter par batch
    let updated = 0;
    let notFound = 0;
    let errors = 0;

    console.log(`🚀 Traitement par batch de ${BATCH_SIZE}...\n`);

    for (let i = 0; i < salinesProducts.length; i += BATCH_SIZE) {
        const batch = salinesProducts.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(salinesProducts.length / BATCH_SIZE);

        console.log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} produits)...`);

        for (const product of batch) {
            try {
                const phardevData = phardevByEan.get(product.ean!);

                if (!phardevData) {
                    notFound++;
                    continue;
                }

                // Mettre à jour les données de base
                await salines.product.update({
                    where: { id: product.id },
                    data: {
                        name: phardevData.name,
                        description: phardevData.description,
                        composition: phardevData.composition,
                        usageTips: phardevData.instructions_for_use,
                    },
                });

                // Associer le laboratoire
                if (phardevData.laboratory_uuid) {
                    const brandId = laboratoryMapping.get(phardevData.laboratory_uuid);
                    if (brandId) {
                        await salines.productBrand.deleteMany({ where: { productId: product.id } });
                        await salines.productBrand.create({
                            data: { productId: product.id, brandId }
                        });
                    }
                }

                // Associer les catégories
                const productCats = categoriesByProduct.get(phardevData.uuid) || [];
                if (productCats.length > 0) {
                    await salines.productCategory.deleteMany({ where: { productId: product.id } });

                    const validCategoryIds = productCats
                        .map(uuid => categoryMapping.get(uuid))
                        .filter(id => id) as string[];

                    if (validCategoryIds.length > 0) {
                        await salines.productCategory.createMany({
                            data: validCategoryIds.map(categoryId => ({
                                productId: product.id,
                                categoryId,
                            })),
                        });
                    }
                }

                // Associer les images
                const productImages = imagesByProduct.get(phardevData.uuid) || [];
                if (productImages.length > 0) {
                    await salines.productImage.deleteMany({ where: { productId: product.id } });

                    await salines.productImage.createMany({
                        data: productImages.map(img => ({
                            productId: product.id,
                            url: buildImageUrl('products', img.image_hash)!,
                            position: img.order,
                        })),
                    });
                }

                updated++;
            } catch (error) {
                console.error(`   ❌ Erreur pour ${product.name}:`, error);
                errors++;
            }
        }

        const progress = ((i + batch.length) / salinesProducts.length * 100).toFixed(1);
        console.log(`   ✅ ${updated} mis à jour, ${notFound} non trouvés, ${errors} erreurs (${progress}%)\n`);
    }

    console.log(`\n🎉 Migration terminée:`);
    console.log(`   ✅ ${updated} produits mis à jour`);
    console.log(`   ⚠️  ${notFound} produits non trouvés dans phardev`);
    console.log(`   ❌ ${errors} erreurs`);
}

async function main() {
    const startTime = Date.now();

    try {
        console.log('🚀 === MIGRATION OPTIMISÉE phardev → Salines ===\n');

        await loadMappings();
        await migrateProductsBatch();

        const duration = Math.round((Date.now() - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        console.log(`\n⏱️  Durée totale: ${minutes}m ${seconds}s`);
        console.log('\n🎉 === MIGRATION TERMINÉE ===\n');
    } catch (error) {
        console.error('\n❌ Erreur:', error);
        throw error;
    } finally {
        await phardev.$disconnect();
        await salines.$disconnect();
    }
}

main();
