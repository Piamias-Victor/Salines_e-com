import { prisma } from '@/lib/prisma';
import { fetchWinPharmaStock } from './service';
import { v4 as uuidv4 } from 'uuid';

const PASSERELLE_CATEGORY_UUID = 'e1402501-b888-4242-9e30-d7c4c85e76fa';

function computePriceWithoutTax(prixTtc: number, tva: number): number {
    return prixTtc / (1 + tva / 100);
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export async function syncWinPharmaProducts() {
    console.log('🚀 Starting WinPharma Sync...');

    try {
        const data = await fetchWinPharmaStock();

        // Navigate XML structure safely
        const products = data?.belreponse?.sstock?.[0]?.produit || [];

        console.log(`📦 Found ${products.length} products to sync.`);

        let processed = 0;
        let errors = 0;

        for (const p of products) {
            try {
                const ean = p.codeproduit[0];
                const name = p.designation[0];
                const stock = parseInt(p.stock[0] || '0');
                const tva = parseFloat(p.tva[0]?.replace(',', '.') || '20');
                const priceTTC = parseFloat(p.prixttc[0]?.replace(',', '.') || '0');

                const priceHT = computePriceWithoutTax(priceTTC, tva);

                // Skip invalid products
                if (!ean || !name) continue;

                // Check existing
                const existing = await prisma.product.findUnique({
                    where: { ean: ean }
                });

                if (existing) {
                    await prisma.product.update({
                        where: { id: existing.id },
                        data: {
                            stock: stock,
                            priceHT: priceHT,
                            priceTTC: priceTTC,
                            tva: tva,
                            updatedAt: new Date(),
                        }
                    });
                } else {
                    const slug = generateSlug(name) + '-' + ean.slice(-4);
                    const newProduct = await prisma.product.create({
                        data: {
                            stock: stock,
                            name: name,
                            ean: ean,
                            slug,
                            priceHT: priceHT,
                            priceTTC: priceTTC,
                            tva: tva,
                            isActive: true,
                            isMedicament: false,
                            weight: 0
                        }
                    });

                    // Link to Category
                    try {
                        await prisma.productCategory.create({
                            data: {
                                productId: newProduct.id,
                                categoryId: PASSERELLE_CATEGORY_UUID
                            }
                        });
                    } catch (catErr) {
                        // Category might not exist, log and continue
                        console.warn(`Could not link category for ${name} (UUID: ${PASSERELLE_CATEGORY_UUID})`);
                    }
                }

                processed++;
                if (processed % 100 === 0) console.log(`Processed ${processed} products...`);

            } catch (err) {
                console.error(`Error processing product ${p.codeproduit?.[0]}:`, err);
                errors++;
            }
        }

        console.log(`✅ Sync completed. Processed: ${processed}, Errors: ${errors}`);
        return { processed, errors };

    } catch (error) {
        console.error('❌ Fatal Sync Error:', error);
        throw error;
    }
}
