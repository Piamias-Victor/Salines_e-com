import { PrismaClient } from '@prisma/client';

const PHARDEV_URL = 'postgresql://phardev_owner:iUPZSl3ehC9T@ep-rapid-wave-a2o7mwyr-pooler.eu-central-1.aws.neon.tech/phardev?sslmode=require&channel_binding=require';
const SALINES_URL = process.env.DATABASE_URL!;

const phardev = new PrismaClient({ datasourceUrl: PHARDEV_URL });
const salines = new PrismaClient({ datasourceUrl: SALINES_URL });

const S3_BASE_URL = 'https://praden.s3.eu-west-3.amazonaws.com/public';

async function testProduct() {
    const ean = '3400941533969';

    console.log(`🔍 Test du produit EAN: ${ean}\n`);

    // 1. Chercher dans Salines
    console.log('📦 Recherche dans Base Salines...');
    const salinesProduct = await salines.product.findFirst({
        where: { ean },
        select: {
            id: true,
            name: true,
            ean: true,
            description: true,
            composition: true,
            usageTips: true,
        }
    });

    if (!salinesProduct) {
        console.log('❌ Produit non trouvé dans Base Salines');
        return;
    }

    console.log(`✅ Trouvé: ${salinesProduct.name}\n`);

    // 2. Chercher dans phardev
    console.log('📦 Recherche dans Base phardev...');
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
    console.log(`✅ Trouvé: ${phardevData.name}\n`);

    // 3. Récupérer les images
    console.log('🖼️  Recherche images...');
    const phardevImages = await phardev.$queryRaw<any[]>`
    SELECT image_hash, "order"
    FROM product_images
    WHERE product_uuid = ${phardevData.uuid}
    ORDER BY "order"
  `;

    console.log(`   Nombre d'images: ${phardevImages.length}\n`);

    if (phardevImages.length > 0) {
        console.log('📸 URLs S3 des images:\n');
        phardevImages.forEach((img, idx) => {
            const url = `${S3_BASE_URL}/products/${img.image_hash}`;
            console.log(`   ${idx + 1}. ${url}`);
        });
    } else {
        console.log('⚠️  Aucune image trouvée');
    }

    console.log('\n📋 Détails du produit:\n');
    console.log(`Nom phardev: ${phardevData.name}`);
    console.log(`Nom Salines: ${salinesProduct.name}`);
    console.log(`Description: ${phardevData.description?.substring(0, 100)}...`);
    console.log(`Composition: ${phardevData.composition?.substring(0, 100)}...`);
    console.log(`Instructions: ${phardevData.instructions_for_use?.substring(0, 100)}...`);

    await phardev.$disconnect();
    await salines.$disconnect();
}

testProduct();
