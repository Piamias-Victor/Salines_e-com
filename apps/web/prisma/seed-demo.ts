import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting demo data seed...');

    // ============================================================================
    // 1. CLEAR EXISTING DATA (except users)
    // ============================================================================
    console.log('🧹 Cleaning existing data...');

    // Only clean core models - others will be cleaned via cascade
    try {
        await prisma.banner.deleteMany();
        console.log('✅ Banners cleaned');
    } catch (e) { console.log('⚠️  Skip banners'); }

    try {
        await prisma.promotion.deleteMany();
        console.log('✅ Promotions cleaned');
    } catch (e) { console.log('⚠️  Skip promotions'); }

    try {
        await prisma.product.deleteMany();
        console.log('✅ Products cleaned (cascade will clean relations)');
    } catch (e) { console.log('⚠️  Skip products'); }

    try {
        await prisma.category.deleteMany();
        console.log('✅ Categories cleaned');
    } catch (e) { console.log('⚠️  Skip categories'); }

    try {
        await prisma.brand.deleteMany();
        console.log('✅ Brands cleaned');
    } catch (e) { console.log('⚠️  Skip brands'); }

    console.log('✅ Data cleaned');

    // ============================================================================
    // 2. CREATE BRANDS
    // ============================================================================
    console.log('🏷️  Creating brands...');

    const brands = await Promise.all([
        // Parapharmacie
        prisma.brand.create({ data: { name: 'La Roche-Posay', slug: 'la-roche-posay', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', position: 1, isActive: true } }),
        prisma.brand.create({ data: { name: 'Vichy', slug: 'vichy', imageUrl: 'https://images.unsplash.com/photo-1556228841-a5b7e1c0b0e8?w=400', position: 2, isActive: true } }),
        prisma.brand.create({ data: { name: 'Avène', slug: 'avene', imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', position: 3, isActive: true } }),
        prisma.brand.create({ data: { name: 'Bioderma', slug: 'bioderma', imageUrl: 'https://images.unsplash.com/photo-1556228578-dd5e8f7c0e5d?w=400', position: 4, isActive: true } }),
        prisma.brand.create({ data: { name: 'Nuxe', slug: 'nuxe', imageUrl: 'https://images.unsplash.com/photo-1556228841-db7e3f3b3e3f?w=400', position: 5, isActive: true } }),
        prisma.brand.create({ data: { name: 'Caudalie', slug: 'caudalie', imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', position: 6, isActive: true } }),
        prisma.brand.create({ data: { name: 'Mustela', slug: 'mustela', imageUrl: 'https://images.unsplash.com/photo-1556228841-a5b7e1c0b0e8?w=400', position: 7, isActive: true } }),
        prisma.brand.create({ data: { name: 'Weleda', slug: 'weleda', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', position: 8, isActive: true } }),
        prisma.brand.create({ data: { name: 'Eucerin', slug: 'eucerin', imageUrl: 'https://images.unsplash.com/photo-1556228841-db7e3f3b3e3f?w=400', position: 9, isActive: true } }),
        prisma.brand.create({ data: { name: 'CeraVe', slug: 'cerave', imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', position: 10, isActive: true } }),

        // Médicaments OTC
        prisma.brand.create({ data: { name: 'Sanofi', slug: 'sanofi', imageUrl: 'https://placehold.co/400x400/0066CC/white?text=Sanofi', position: 11, isActive: true } }),
        prisma.brand.create({ data: { name: 'Urgo', slug: 'urgo', imageUrl: 'https://placehold.co/400x400/00AA55/white?text=Urgo', position: 12, isActive: true } }),
        prisma.brand.create({ data: { name: 'UPSA', slug: 'upsa', imageUrl: 'https://placehold.co/400x400/FF6600/white?text=UPSA', position: 13, isActive: true } }),
        prisma.brand.create({ data: { name: 'Biafine', slug: 'biafine', imageUrl: 'https://placehold.co/400x400/009966/white?text=Biafine', position: 14, isActive: true } }),
        prisma.brand.create({ data: { name: 'Compeed', slug: 'compeed', imageUrl: 'https://placehold.co/400x400/0099CC/white?text=Compeed', position: 15, isActive: true } }),
    ]);

    console.log(`✅ Created ${brands.length} brands`);

    // ============================================================================
    // 3. CREATE CATEGORIES
    // ============================================================================
    console.log('📁 Creating categories...');

    // Main categories
    const medicament = await prisma.category.create({
        data: {
            name: 'Médicament',
            slug: 'medicament',
            description: 'Médicaments sans ordonnance',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
            position: 1,
            menuPosition: 1,
            isActive: true,
        },
    });

    const beauteHygiene = await prisma.category.create({
        data: {
            name: 'Beauté & Hygiène',
            slug: 'beaute-hygiene',
            description: 'Soins et produits de beauté',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
            position: 2,
            menuPosition: 2,
            isActive: true,
        },
    });

    const sante = await prisma.category.create({
        data: {
            name: 'Santé',
            slug: 'sante',
            description: 'Produits de santé et bien-être',
            imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
            position: 3,
            menuPosition: 3,
            isActive: true,
        },
    });

    const bebeMaman = await prisma.category.create({
        data: {
            name: 'Bébé & Maman',
            slug: 'bebe-maman',
            description: 'Soins pour bébé et maman',
            imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
            position: 4,
            menuPosition: 4,
            isActive: true,
        },
    });

    const complements = await prisma.category.create({
        data: {
            name: 'Compléments alimentaires',
            slug: 'complements-alimentaires',
            description: 'Vitamines et compléments',
            imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
            position: 5,
            menuPosition: 5,
            isActive: true,
        },
    });

    const promosNouveautes = await prisma.category.create({
        data: {
            name: 'Promos & Nouveautés',
            slug: 'promos-nouveautes',
            description: 'Nos meilleures offres',
            imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
            position: 6,
            menuPosition: 6,
            highlightColor: '#fe0090',
            highlightTextColor: '#fef000',
            isActive: true,
        },
    });

    const bioNaturel = await prisma.category.create({
        data: {
            name: 'Bio & Naturel',
            slug: 'bio-naturel',
            description: 'Produits bio et naturels',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
            position: 7,
            menuPosition: 7,
            isActive: true,
        },
    });

    // Subcategories for Beauté & Hygiène
    const visage = await prisma.category.create({
        data: {
            name: 'Visage',
            slug: 'visage',
            description: 'Soins du visage',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
            position: 1,
            menuPosition: 1,
            isActive: true,
            parents: { connect: [{ id: beauteHygiene.id }] },
        },
    });

    const corps = await prisma.category.create({
        data: {
            name: 'Corps',
            slug: 'corps',
            description: 'Soins du corps',
            imageUrl: 'https://images.unsplash.com/photo-1556228841-a5b7e1c0b0e8?w=400',
            position: 2,
            menuPosition: 2,
            isActive: true,
            parents: { connect: [{ id: beauteHygiene.id }] },
        },
    });

    const cheveux = await prisma.category.create({
        data: {
            name: 'Cheveux',
            slug: 'cheveux',
            description: 'Soins capillaires',
            imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
            position: 3,
            menuPosition: 3,
            isActive: true,
            parents: { connect: [{ id: beauteHygiene.id }] },
        },
    });

    const solaire = await prisma.category.create({
        data: {
            name: 'Solaire',
            slug: 'solaire',
            description: 'Protection solaire',
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            position: 4,
            menuPosition: 4,
            isActive: true,
            parents: { connect: [{ id: beauteHygiene.id }] },
        },
    });

    const hygiene = await prisma.category.create({
        data: {
            name: 'Hygiène',
            slug: 'hygiene',
            description: 'Produits d\'hygiène',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
            position: 5,
            menuPosition: 5,
            isActive: true,
            parents: { connect: [{ id: beauteHygiene.id }] },
        },
    });

    console.log('✅ Created 12 categories (7 main + 5 subcategories)');

    // ============================================================================
    // 4. CREATE PROMOTIONS
    // ============================================================================
    console.log('🎁 Creating promotions...');

    const promoSoldes = await prisma.promotion.create({
        data: {
            title: 'Soldes d\'Hiver',
            imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
            amount: 20,
            type: 'PERCENT',
            redirectUrl: '/promos-nouveautes',
            position: 1,
            isActive: true,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-28'),
            buttonText: 'JE FONCE',
            buttonColor: '#fe0090',
            buttonTextColor: '#ffffff',
        },
    });

    const promoBlackFriday = await prisma.promotion.create({
        data: {
            title: 'Black Friday',
            imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600',
            amount: 30,
            type: 'PERCENT',
            redirectUrl: '/promos-nouveautes',
            position: 2,
            isActive: true,
            startDate: new Date('2024-11-20'),
            endDate: new Date('2024-11-30'),
            buttonText: 'PROFITER',
            buttonColor: '#000000',
            buttonTextColor: '#fef000',
        },
    });

    const promoNouveaux = await prisma.promotion.create({
        data: {
            title: 'Nouveaux clients -10%',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
            amount: 10,
            type: 'PERCENT',
            redirectUrl: '/beaute-hygiene',
            position: 3,
            isActive: true,
            buttonText: 'DÉCOUVRIR',
            buttonColor: '#fe0090',
            buttonTextColor: '#ffffff',
        },
    });

    console.log('✅ Created 3 promotions');

    // ============================================================================
    // 5. CREATE BANNERS
    // ============================================================================
    console.log('🎨 Creating banners...');

    await Promise.all([
        prisma.banner.create({
            data: {
                title: 'Soldes d\'Hiver',
                alt: 'Soldes d\'hiver jusqu\'à -30%',
                imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
                redirectUrl: '/promos-nouveautes',
                position: 1,
                isActive: true,
                text: 'Jusqu\'à -30% sur une sélection',
                textColor: '#ffffff',
                showButton: true,
                buttonColor: '#fe0090',
            },
        }),
        prisma.banner.create({
            data: {
                title: 'Livraison Gratuite',
                alt: 'Livraison gratuite dès 50€',
                imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200',
                redirectUrl: '/beaute-hygiene',
                position: 2,
                isActive: true,
                text: 'Livraison gratuite dès 50€ d\'achat',
                textColor: '#3f4c53',
                showButton: true,
                buttonColor: '#fe0090',
            },
        }),
        prisma.banner.create({
            data: {
                title: 'La Roche-Posay',
                alt: 'Découvrez La Roche-Posay',
                imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200',
                redirectUrl: '/beaute-hygiene/visage',
                position: 3,
                isActive: true,
                text: 'Nouveautés La Roche-Posay',
                textColor: '#ffffff',
                showButton: true,
                buttonColor: '#0066CC',
            },
        }),
        prisma.banner.create({
            data: {
                title: 'Black Friday',
                alt: 'Black Friday - Offres exceptionnelles',
                imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200',
                redirectUrl: '/promos-nouveautes',
                position: 4,
                isActive: true,
                text: 'Black Friday - Jusqu\'à -30%',
                textColor: '#fef000',
                showButton: true,
                buttonColor: '#000000',
            },
        }),
        prisma.banner.create({
            data: {
                title: 'Bio & Naturel',
                alt: 'Produits bio et naturels',
                imageUrl: 'https://images.unsplash.com/photo-1556228841-db7e3f3b3e3f?w=1200',
                redirectUrl: '/bio-naturel',
                position: 5,
                isActive: true,
                text: 'Découvrez notre gamme bio',
                textColor: '#ffffff',
                showButton: true,
                buttonColor: '#00AA55',
            },
        }),
    ]);

    console.log('✅ Created 5 banners');

    // ============================================================================
    // 6. CREATE PRODUCTS
    // ============================================================================
    console.log('📦 Creating products...');

    const productsData = [
        // VISAGE
        {
            name: 'La Roche-Posay Effaclar Duo+',
            ean: '3337875545778',
            description: 'Soin anti-imperfections correcteur et désincrustant',
            shortDescription: 'Soin anti-imperfections',
            slug: 'la-roche-posay-effaclar-duo-plus',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
            priceHT: 12.50,
            priceTTC: 15.00,
            tva: 20.00,
            stock: 50,
            weight: 0.04,
            brandId: brands[0].id,
            categoryIds: [visage.id],
        },
        {
            name: 'Vichy Minéral 89',
            ean: '3337871330415',
            description: 'Concentré fortifiant et repulpant à l\'acide hyaluronique',
            shortDescription: 'Sérum hydratant',
            slug: 'vichy-mineral-89',
            imageUrl: 'https://images.unsplash.com/photo-1556228841-a5b7e1c0b0e8?w=400',
            priceHT: 16.67,
            priceTTC: 20.00,
            tva: 20.00,
            stock: 40,
            weight: 0.05,
            brandId: brands[1].id,
            categoryIds: [visage.id],
            promotionId: promoSoldes.id,
        },
        {
            name: 'Avène Eau Thermale Spray',
            ean: '3282779003001',
            description: 'Eau thermale apaisante et anti-irritante',
            shortDescription: 'Eau thermale apaisante',
            slug: 'avene-eau-thermale-spray',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
            priceHT: 6.67,
            priceTTC: 8.00,
            tva: 20.00,
            stock: 100,
            weight: 0.15,
            brandId: brands[2].id,
            categoryIds: [visage.id],
        },
        {
            name: 'Bioderma Sensibio H2O',
            ean: '3401360116016',
            description: 'Solution micellaire démaquillante peaux sensibles',
            shortDescription: 'Eau micellaire',
            slug: 'bioderma-sensibio-h2o',
            imageUrl: 'https://images.unsplash.com/photo-1556228841-db7e3f3b3e3f?w=400',
            priceHT: 10.00,
            priceTTC: 12.00,
            tva: 20.00,
            stock: 80,
            weight: 0.25,
            brandId: brands[3].id,
            categoryIds: [visage.id],
        },
        {
            name: 'CeraVe Crème Hydratante',
            ean: '3337875597388',
            description: 'Crème hydratante visage et corps',
            shortDescription: 'Crème hydratante',
            slug: 'cerave-creme-hydratante',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
            priceHT: 12.50,
            priceTTC: 15.00,
            tva: 20.00,
            stock: 60,
            weight: 0.34,
            brandId: brands[9].id,
            categoryIds: [visage.id, corps.id],
        },

        // CORPS
        {
            name: 'Nuxe Huile Prodigieuse',
            ean: '3264680009556',
            description: 'Huile sèche multi-fonctions visage, corps et cheveux',
            shortDescription: 'Huile sèche multi-usages',
            slug: 'nuxe-huile-prodigieuse',
            imageUrl: 'https://images.unsplash.com/photo-1556228841-a5b7e1c0b0e8?w=400',
            priceHT: 15.00,
            priceTTC: 18.00,
            tva: 20.00,
            stock: 45,
            weight: 0.1,
            brandId: brands[4].id,
            categoryIds: [corps.id],
            promotionId: promoBlackFriday.id,
        },
        {
            name: 'Caudalie Vinosource Lait Hydratant',
            ean: '3522930001645',
            description: 'Lait corps hydratant et nourrissant',
            shortDescription: 'Lait corps hydratant',
            slug: 'caudalie-vinosource-lait',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
            priceHT: 14.17,
            priceTTC: 17.00,
            tva: 20.00,
            stock: 35,
            weight: 0.2,
            brandId: brands[5].id,
            categoryIds: [corps.id],
        },
        {
            name: 'Eucerin Crème Pieds Réparatrice',
            ean: '4005800036446',
            description: 'Crème réparatrice pour pieds très secs',
            shortDescription: 'Soin pieds',
            slug: 'eucerin-creme-pieds',
            priceHT: 8.33,
            priceTTC: 10.00,
            tva: 20.00,
            stock: 50,
            weight: 0.1,
            brandId: brands[8].id,
            categoryIds: [corps.id],
        },

        // CHEVEUX
        {
            name: 'Vichy Dercos Shampooing Anti-Pelliculaire',
            ean: '3337871330422',
            description: 'Shampooing traitant anti-pelliculaire',
            shortDescription: 'Shampooing anti-pelliculaire',
            slug: 'vichy-dercos-shampooing',
            imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
            priceHT: 10.83,
            priceTTC: 13.00,
            tva: 20.00,
            stock: 40,
            weight: 0.2,
            brandId: brands[1].id,
            categoryIds: [cheveux.id],
        },
        {
            name: 'Nuxe Shampooing Douceur',
            ean: '3264680009563',
            description: 'Shampooing doux usage fréquent',
            shortDescription: 'Shampooing doux',
            slug: 'nuxe-shampooing-douceur',
            imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
            priceHT: 9.17,
            priceTTC: 11.00,
            tva: 20.00,
            stock: 50,
            weight: 0.2,
            brandId: brands[4].id,
            categoryIds: [cheveux.id],
        },

        // SOLAIRE
        {
            name: 'La Roche-Posay Anthelios SPF50+',
            ean: '3337875545785',
            description: 'Crème solaire très haute protection',
            shortDescription: 'Protection solaire SPF50+',
            slug: 'la-roche-posay-anthelios-spf50',
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            priceHT: 14.17,
            priceTTC: 17.00,
            tva: 20.00,
            stock: 70,
            weight: 0.05,
            brandId: brands[0].id,
            categoryIds: [solaire.id],
        },
        {
            name: 'Avène Solaire SPF50+',
            ean: '3282779003018',
            description: 'Crème solaire peaux sensibles',
            shortDescription: 'Protection solaire peaux sensibles',
            slug: 'avene-solaire-spf50',
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            priceHT: 13.33,
            priceTTC: 16.00,
            tva: 20.00,
            stock: 60,
            weight: 0.05,
            brandId: brands[2].id,
            categoryIds: [solaire.id],
        },
        {
            name: 'Bioderma Photoderm MAX SPF50+',
            ean: '3401360116023',
            description: 'Crème solaire très haute protection',
            shortDescription: 'Protection maximale SPF50+',
            slug: 'bioderma-photoderm-max',
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            priceHT: 12.50,
            priceTTC: 15.00,
            tva: 20.00,
            stock: 55,
            weight: 0.04,
            brandId: brands[3].id,
            categoryIds: [solaire.id],
        },

        // HYGIÈNE
        {
            name: 'Bioderma Atoderm Gel Douche',
            ean: '3401360116030',
            description: 'Gel douche ultra-doux peaux sensibles',
            shortDescription: 'Gel douche peaux sensibles',
            slug: 'bioderma-atoderm-gel-douche',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
            priceHT: 8.33,
            priceTTC: 10.00,
            tva: 20.00,
            stock: 80,
            weight: 0.5,
            brandId: brands[3].id,
            categoryIds: [hygiene.id],
        },
        {
            name: 'La Roche-Posay Déodorant 24h',
            ean: '3337875545792',
            description: 'Déodorant physiologique 24h',
            shortDescription: 'Déodorant 24h',
            slug: 'la-roche-posay-deodorant',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
            priceHT: 7.50,
            priceTTC: 9.00,
            tva: 20.00,
            stock: 90,
            weight: 0.05,
            brandId: brands[0].id,
            categoryIds: [hygiene.id],
        },

        // BÉBÉ & MAMAN
        {
            name: 'Mustela Gel Lavant Doux',
            ean: '3504105028541',
            description: 'Gel lavant doux cheveux et corps',
            shortDescription: 'Gel lavant bébé',
            slug: 'mustela-gel-lavant-doux',
            imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
            priceHT: 7.50,
            priceTTC: 9.00,
            tva: 20.00,
            stock: 60,
            weight: 0.2,
            brandId: brands[6].id,
            categoryIds: [bebeMaman.id],
        },
        {
            name: 'Mustela Crème Change',
            ean: '3504105028558',
            description: 'Crème protectrice pour le change',
            shortDescription: 'Crème change bébé',
            slug: 'mustela-creme-change',
            imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
            priceHT: 6.67,
            priceTTC: 8.00,
            tva: 20.00,
            stock: 70,
            weight: 0.1,
            brandId: brands[6].id,
            categoryIds: [bebeMaman.id],
        },
        {
            name: 'Weleda Huile de Massage Bébé',
            ean: '4001638088015',
            description: 'Huile de massage au calendula',
            shortDescription: 'Huile massage bébé',
            slug: 'weleda-huile-massage-bebe',
            imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
            priceHT: 10.83,
            priceTTC: 13.00,
            tva: 20.00,
            stock: 45,
            weight: 0.2,
            brandId: brands[7].id,
            categoryIds: [bebeMaman.id, bioNaturel.id],
        },

        // MÉDICAMENTS
        {
            name: 'Doliprane 1000mg',
            ean: '3400930001110',
            description: 'Paracétamol 1000mg - Douleurs et fièvre',
            shortDescription: 'Antidouleur et antipyrétique',
            slug: 'doliprane-1000mg',
            imageUrl: 'https://placehold.co/400x400/0066CC/white?text=Doliprane',
            priceHT: 3.33,
            priceTTC: 4.00,
            tva: 20.00,
            stock: 200,
            weight: 0.02,
            isMedicament: true,
            brandId: brands[10].id, // Sanofi
            categoryIds: [medicament.id],
        },
        {
            name: 'UPSA Efferalgan 1g',
            ean: '3400930002223',
            description: 'Paracétamol effervescent 1g',
            shortDescription: 'Antidouleur effervescent',
            slug: 'upsa-efferalgan-1g',
            imageUrl: 'https://placehold.co/400x400/FF6600/white?text=Efferalgan',
            priceHT: 4.17,
            priceTTC: 5.00,
            tva: 20.00,
            stock: 150,
            weight: 0.03,
            isMedicament: true,
            brandId: brands[12].id, // UPSA
            categoryIds: [medicament.id],
        },
        {
            name: 'Biafine Emulsion',
            ean: '3400930003334',
            description: 'Emulsion pour brûlures et coups de soleil',
            shortDescription: 'Soin des brûlures',
            slug: 'biafine-emulsion',
            imageUrl: 'https://placehold.co/400x400/009966/white?text=Biafine',
            priceHT: 8.33,
            priceTTC: 10.00,
            tva: 20.00,
            stock: 100,
            weight: 0.186,
            brandId: brands[13].id, // Biafine
            categoryIds: [medicament.id, sante.id],
        },
        {
            name: 'Urgo Pansements Assortis',
            ean: '3400930004445',
            description: 'Boîte de pansements assortis',
            shortDescription: 'Pansements premiers soins',
            slug: 'urgo-pansements-assortis',
            imageUrl: 'https://placehold.co/400x400/00AA55/white?text=Urgo',
            priceHT: 5.00,
            priceTTC: 6.00,
            tva: 20.00,
            stock: 120,
            weight: 0.05,
            brandId: brands[11].id, // Urgo
            categoryIds: [medicament.id, sante.id],
        },
        {
            name: 'Compeed Ampoules Pieds',
            ean: '3400930005556',
            description: 'Pansements hydrocolloïdes pour ampoules',
            shortDescription: 'Pansements ampoules',
            slug: 'compeed-ampoules-pieds',
            imageUrl: 'https://placehold.co/400x400/0099CC/white?text=Compeed',
            priceHT: 6.67,
            priceTTC: 8.00,
            tva: 20.00,
            stock: 80,
            weight: 0.02,
            brandId: brands[14].id, // Compeed
            categoryIds: [medicament.id, sante.id],
        },

        // COMPLÉMENTS ALIMENTAIRES
        {
            name: 'Vitamine D3 1000 UI',
            ean: '3400930006667',
            description: 'Complément en vitamine D3',
            shortDescription: 'Vitamine D3',
            slug: 'vitamine-d3-1000ui',
            imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
            priceHT: 8.33,
            priceTTC: 10.00,
            tva: 20.00,
            stock: 90,
            weight: 0.05,
            brandId: brands[10].id,
            categoryIds: [complements.id, sante.id],
        },
        {
            name: 'Magnésium Marin B6',
            ean: '3400930007778',
            description: 'Magnésium d\'origine marine + vitamine B6',
            shortDescription: 'Anti-fatigue',
            slug: 'magnesium-marin-b6',
            imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
            priceHT: 10.83,
            priceTTC: 13.00,
            tva: 20.00,
            stock: 70,
            weight: 0.08,
            brandId: brands[10].id,
            categoryIds: [complements.id, sante.id],
        },
        {
            name: 'Probiotiques Flore Intestinale',
            ean: '3400930008889',
            description: 'Probiotiques pour l\'équilibre de la flore',
            shortDescription: 'Probiotiques',
            slug: 'probiotiques-flore',
            imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
            priceHT: 16.67,
            priceTTC: 20.00,
            tva: 20.00,
            stock: 50,
            weight: 0.06,
            brandId: brands[10].id,
            categoryIds: [complements.id, sante.id],
        },

        // BIO & NATUREL
        {
            name: 'Weleda Crème Visage Amande',
            ean: '4001638088022',
            description: 'Crème visage bio peaux sensibles',
            shortDescription: 'Crème visage bio',
            slug: 'weleda-creme-visage-amande',
            imageUrl: 'https://images.unsplash.com/photo-1556228841-db7e3f3b3e3f?w=400',
            priceHT: 12.50,
            priceTTC: 15.00,
            tva: 20.00,
            stock: 40,
            weight: 0.03,
            brandId: brands[7].id,
            categoryIds: [bioNaturel.id, visage.id],
        },
        {
            name: 'Weleda Huile de Massage Arnica',
            ean: '4001638088039',
            description: 'Huile de massage bio à l\'arnica',
            shortDescription: 'Huile massage arnica bio',
            slug: 'weleda-huile-arnica',
            imageUrl: 'https://images.unsplash.com/photo-1556228841-a5b7e1c0b0e8?w=400',
            priceHT: 14.17,
            priceTTC: 17.00,
            tva: 20.00,
            stock: 35,
            weight: 0.1,
            brandId: brands[7].id,
            categoryIds: [bioNaturel.id, corps.id],
        },
        {
            name: 'Caudalie Eau de Raisin Bio',
            ean: '3522930001652',
            description: 'Brume hydratante bio',
            shortDescription: 'Brume hydratante bio',
            slug: 'caudalie-eau-raisin-bio',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
            priceHT: 10.00,
            priceTTC: 12.00,
            tva: 20.00,
            stock: 50,
            weight: 0.2,
            brandId: brands[5].id,
            categoryIds: [bioNaturel.id, visage.id],
        },
    ];

    // Create products
    const createdProducts = [];
    for (const productData of productsData) {
        const { brandId, categoryIds, promotionId, ...data } = productData;

        const product = await prisma.product.create({
            data: {
                ...data,
            },
        });

        // Link to brand
        await prisma.productBrand.create({
            data: {
                productId: product.id,
                brandId: brandId,
            },
        });

        // Link to categories
        for (const categoryId of categoryIds) {
            await prisma.productCategory.create({
                data: {
                    productId: product.id,
                    categoryId: categoryId,
                },
            });
        }

        // Link to promotion if exists
        if (promotionId) {
            await prisma.productPromotion.create({
                data: {
                    productId: product.id,
                    promotionId: promotionId,
                },
            });
        }

        createdProducts.push(product);
    }

    console.log(`✅ Created ${createdProducts.length} products`);

    // ============================================================================
    // 7. CREATE FEATURED PRODUCTS
    // ============================================================================
    console.log('⭐ Creating featured products...');

    const featuredProducts = createdProducts.slice(0, 10);
    for (let i = 0; i < featuredProducts.length; i++) {
        await prisma.featuredProduct.create({
            data: {
                productId: featuredProducts[i].id,
                position: i + 1,
                isActive: true,
            },
        });
    }

    console.log(`✅ Created ${featuredProducts.length} featured products`);

    // ============================================================================
    // DONE
    // ============================================================================
    console.log('');
    // ============================================================================
    // 8. CREATE SHIPPING METHODS
    // ============================================================================
    console.log('🚚 Creating shipping methods...');

    await prisma.shippingMethod.deleteMany();

    await Promise.all([
        prisma.shippingMethod.create({
            data: {
                name: 'Retrait en Pharmacie',
                type: 'PHARMACY',
                description: 'Retrait gratuit en 2h',
                isActive: true,
                freeShippingThreshold: 0,
                rates: {
                    create: {
                        minWeight: 0,
                        maxWeight: 100,
                        price: 0,
                    },
                },
            },
        }),
        prisma.shippingMethod.create({
            data: {
                name: 'Livraison à Domicile',
                type: 'HOME',
                description: 'Colissimo 48h',
                isActive: true,
                freeShippingThreshold: 50,
                rates: {
                    create: [
                        { minWeight: 0, maxWeight: 0.25, price: 4.90 },
                        { minWeight: 0.25, maxWeight: 0.5, price: 5.90 },
                        { minWeight: 0.5, maxWeight: 1, price: 6.90 },
                        { minWeight: 1, maxWeight: 2, price: 7.90 },
                        { minWeight: 2, maxWeight: 5, price: 9.90 },
                    ],
                },
            },
        }),
        prisma.shippingMethod.create({
            data: {
                name: 'Point Relais',
                type: 'RELAY',
                description: 'Mondial Relay 3-5 jours',
                isActive: true,
                freeShippingThreshold: 40,
                rates: {
                    create: [
                        { minWeight: 0, maxWeight: 1, price: 3.90 },
                        { minWeight: 1, maxWeight: 3, price: 4.90 },
                        { minWeight: 3, maxWeight: 5, price: 5.90 },
                    ],
                },
            },
        }),
    ]);

    console.log('✅ Created 3 shipping methods');

    console.log('🎉 Demo data seed completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - ${brands.length} brands`);
    console.log(`   - 12 categories (7 main + 5 subcategories)`);
    console.log(`   - ${createdProducts.length} products`);
    console.log(`   - 3 promotions`);
    console.log(`   - 5 banners`);
    console.log(`   - ${featuredProducts.length} featured products`);
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
