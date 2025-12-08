import { PrismaClient } from '@prisma/client';

const PHARDEV_URL = 'postgresql://phardev_owner:iUPZSl3ehC9T@ep-rapid-wave-a2o7mwyr-pooler.eu-central-1.aws.neon.tech/phardev?sslmode=require&channel_binding=require';
const SALINES_URL = process.env.DATABASE_URL!;

// Connexion Base phardev (READ ONLY)
const phardev = new PrismaClient({
    datasourceUrl: PHARDEV_URL,
});

// Connexion Base Salines (READ/WRITE)
const salines = new PrismaClient({
    datasourceUrl: SALINES_URL,
});

interface PhardevCategory {
    uuid: string;
    name: string;
    description: string | null;
    parent_uuid: string | null;
    image_hash: string | null;
    miniature_hash: string | null;
    order: number;
    status: string;
}

interface PhardevLaboratory {
    uuid: string;
    name: string;
    description: string | null;
    image_hash: string | null;
}

interface PhardevProduct {
    uuid: string;
    name: string;
    description: string | null;
    instructions_for_use: string | null;
    composition: string | null;
    ean13: string;
    laboratory_uuid: string | null;
}

// Mappings UUID phardev → ID Salines
const categoryMapping = new Map<string, string>();
const laboratoryMapping = new Map<string, string>();

// S3 Base URL
const S3_BASE_URL = 'https://praden.s3.eu-west-3.amazonaws.com/public';

// Helper pour construire les URLs S3
function buildImageUrl(type: 'categories' | 'laboratories' | 'products', hash: string | null): string | null {
    if (!hash) return null;
    return `${S3_BASE_URL}/${type}/${hash}`;
}


async function migrateCategories() {
    console.log('\n📁 === MIGRATION CATÉGORIES ===\n');

    // 1. Lire toutes les catégories depuis phardev
    console.log('📖 Lecture catégories depuis Base phardev...');
    const phardevCategories = await phardev.$queryRaw<PhardevCategory[]>`
    SELECT uuid, name, description, parent_uuid, image_hash, miniature_hash, "order", status
    FROM categories
    ORDER BY "order"
  `;
    console.log(`   ✓ ${phardevCategories.length} catégories trouvées`);

    // 2. Vider les catégories dans Salines
    console.log('\n🗑️  Suppression catégories dans Base Salines...');
    await salines.productCategory.deleteMany({});
    await salines.category.deleteMany({});
    console.log('   ✓ Catégories supprimées');

    // 3. Créer les catégories - d'abord les parents (parent_uuid = null)
    console.log('\n➕ Création catégories parents...');
    const parents = phardevCategories.filter(c => !c.parent_uuid);

    for (const cat of parents) {
        const created = await salines.category.create({
            data: {
                name: cat.name,
                slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + cat.uuid.substring(0, 8),
                description: cat.description,
                imageUrl: buildImageUrl('categories', cat.image_hash),
                thumbnailUrl: buildImageUrl('categories', cat.miniature_hash),
                position: cat.order,
                menuPosition: cat.order,
                isActive: cat.status === 'ACTIVE',
            },
        });

        categoryMapping.set(cat.uuid, created.id);
        console.log(`   ✓ ${cat.name}`);
    }

    // 4. Créer les catégories enfants
    console.log('\n➕ Création catégories enfants...');
    const children = phardevCategories.filter(c => c.parent_uuid);

    for (const cat of children) {
        const parentId = categoryMapping.get(cat.parent_uuid!);

        if (!parentId) {
            console.log(`   ⚠️  Parent non trouvé pour ${cat.name}, skip`);
            continue;
        }

        const created = await salines.category.create({
            data: {
                name: cat.name,
                slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + cat.uuid.substring(0, 8),
                description: cat.description,
                imageUrl: buildImageUrl('categories', cat.image_hash),
                thumbnailUrl: buildImageUrl('categories', cat.miniature_hash),
                position: cat.order,
                menuPosition: cat.order,
                isActive: cat.status === 'ACTIVE',
                parents: {
                    connect: { id: parentId }
                }
            },
        });

        categoryMapping.set(cat.uuid, created.id);
        console.log(`   ✓ ${cat.name} (parent: ${phardevCategories.find(p => p.uuid === cat.parent_uuid)?.name})`);
    }

    console.log(`\n✅ ${categoryMapping.size} catégories créées dans Base Salines`);
}

async function migrateLaboratories() {
    console.log('\n🏢 === MIGRATION LABORATOIRES ===\n');

    // 1. Lire tous les labos depuis phardev
    console.log('📖 Lecture laboratoires depuis Base phardev...');
    const phardevLabs = await phardev.$queryRaw<PhardevLaboratory[]>`
    SELECT uuid, name, description, image_hash
    FROM laboratories
  `;
    console.log(`   ✓ ${phardevLabs.length} laboratoires trouvés`);

    // 2. Vider les brands dans Salines
    console.log('\n🗑️  Suppression brands dans Base Salines...');
    await salines.productBrand.deleteMany({});
    await salines.brand.deleteMany({});
    console.log('   ✓ Brands supprimés');

    // 3. Créer les brands
    console.log('\n➕ Création laboratoires...');
    for (const lab of phardevLabs) {
        const created = await salines.brand.create({
            data: {
                name: lab.name,
                slug: lab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + lab.uuid.substring(0, 8),
                description: lab.description,
                imageUrl: buildImageUrl('laboratories', lab.image_hash),
                isActive: true,
            },
        });

        laboratoryMapping.set(lab.uuid, created.id);
        console.log(`   ✓ ${lab.name}`);
    }

    console.log(`\n✅ ${laboratoryMapping.size} laboratoires créés dans Base Salines`);
}

async function migrateProducts(limit: number = 5) {
    console.log(`\n🛒 === MIGRATION PRODUITS (TEST ${limit} premiers) ===\n`);

    // 1. Récupérer les produits avec EAN13 dans Salines
    console.log('📖 Récupération produits dans Base Salines...');
    const allProducts = await salines.product.findMany({
        select: {
            id: true,
            ean: true,
            name: true,
        },
    });

    // Filtrer ceux qui ont un EAN13
    const salinesProducts = allProducts.filter(p => p.ean).slice(0, limit);
    console.log(`   ✓ ${salinesProducts.length} produits trouvés avec EAN13`);

    // 2. Pour chaque produit, chercher dans phardev et mettre à jour
    let updated = 0;
    let notFound = 0;

    for (const product of salinesProducts) {
        console.log(`\n📦 Traitement: ${product.name} (EAN: ${product.ean})`);

        // Chercher dans phardev
        const phardevProduct = await phardev.$queryRaw<PhardevProduct[]>`
      SELECT p.uuid, p.name, p.description, p.instructions_for_use, p.composition, 
             p.ean13, p.laboratory_uuid
      FROM products p
      WHERE p.ean13 = ${product.ean}
      LIMIT 1
    `;

        if (phardevProduct.length === 0) {
            console.log('   ⚠️  Non trouvé dans Base phardev');
            notFound++;
            continue;
        }

        const phardevData = phardevProduct[0];

        // Préparer les données de mise à jour
        const updateData: any = {
            name: phardevData.name,
            description: phardevData.description,
            composition: phardevData.composition,
            usageTips: phardevData.instructions_for_use,
        };

        // Associer le laboratoire si trouvé
        if (phardevData.laboratory_uuid) {
            const brandId = laboratoryMapping.get(phardevData.laboratory_uuid);
            if (brandId) {
                // D'abord supprimer les anciennes associations
                await salines.productBrand.deleteMany({
                    where: { productId: product.id }
                });

                // Créer nouvelle association
                await salines.productBrand.create({
                    data: {
                        productId: product.id,
                        brandId: brandId,
                    }
                });
                console.log(`   ✓ Laboratoire associé`);
            }
        }

        // Récupérer les catégories du produit dans phardev
        const phardevProductCats = await phardev.$queryRaw<{ category_uuid: string }[]>`
      SELECT category_uuid
      FROM product_categories
      WHERE product_uuid = ${phardevData.uuid}
    `;

        if (phardevProductCats.length > 0) {
            // Supprimer anciennes catégories
            await salines.productCategory.deleteMany({
                where: { productId: product.id }
            });

            // Associer nouvelles catégories
            for (const pc of phardevProductCats) {
                const categoryId = categoryMapping.get(pc.category_uuid);
                if (categoryId) {
                    await salines.productCategory.create({
                        data: {
                            productId: product.id,
                            categoryId: categoryId,
                        }
                    });
                }
            }
            console.log(`   ✓ ${phardevProductCats.length} catégories associées`);
        }

        // Récupérer les images du produit dans phardev
        const phardevImages = await phardev.$queryRaw<{ image_hash: string; order: number }[]>`
      SELECT image_hash, "order"
      FROM product_images
      WHERE product_uuid = ${phardevData.uuid}
      ORDER BY "order"
    `;

        if (phardevImages.length > 0) {
            // Supprimer anciennes images
            await salines.productImage.deleteMany({
                where: { productId: product.id }
            });

            // Ajouter nouvelles images
            for (const img of phardevImages) {
                if (img.image_hash) {
                    await salines.productImage.create({
                        data: {
                            productId: product.id,
                            url: buildImageUrl('products', img.image_hash)!,
                            position: img.order,
                        }
                    });
                }
            }
            console.log(`   ✓ ${phardevImages.length} images associées`);
        }

        // Mettre à jour le produit
        await salines.product.update({
            where: { id: product.id },
            data: updateData,
        });

        console.log(`   ✅ Produit mis à jour: ${phardevData.name}`);
        updated++;
    }

    console.log(`\n✅ Migration terminée: ${updated} produits mis à jour, ${notFound} non trouvés`);
}

async function main() {
    try {
        console.log('🚀 === DÉMARRAGE MIGRATION Base phardev → Base Salines ===\n');
        console.log('⚠️  Base phardev: READ ONLY');
        console.log('✅ Base Salines: READ/WRITE\n');

        // Étape 1: Migration catégories
        await migrateCategories();

        // Étape 2: Migration laboratoires
        await migrateLaboratories();

        // Étape 3: Migration TOUS les produits
        await migrateProducts(99999); // Tous les produits

        console.log('\n🎉 === MIGRATION TERMINÉE ===\n');
    } catch (error) {
        console.error('\n❌ Erreur lors de la migration:', error);
        throw error;
    } finally {
        await phardev.$disconnect();
        await salines.$disconnect();
    }
}

main();
