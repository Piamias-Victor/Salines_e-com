# Pharmacie E-Commerce - Base de données

## 🚀 Configuration

Ce projet utilise **Prisma** avec une base de données **PostgreSQL** hébergée sur **Neon**.

### Prérequis
- Node.js installé
- Compte Neon avec une base de données PostgreSQL

### Installation

```bash
npm install
```

### Configuration de la base de données

1. Copiez le fichier `.env.example` vers `.env`
2. Vérifiez que votre `DATABASE_URL` est correcte dans `.env`

### Commandes Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Réinitialiser la base de données (⚠️ ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

## 📊 Modèle de données

### Product (Produit)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String | Identifiant unique (CUID) |
| `name` | String | Nom du produit |
| `ean` | String | Code EAN unique |
| `description` | String? | Description du produit |
| `slug` | String | URL slug unique (ex: doliprane-1000mg) |
| `imageUrl` | String? | URL de l'image principale |
| `brand` | String? | Marque/Laboratoire |
| `priceHT` | Decimal | Prix Hors Taxe |
| `priceTTC` | Decimal | Prix TTC |
| `tva` | Decimal | Taux de TVA (ex: 20.00) |
| `stock` | Int | Quantité en stock |
| `isActive` | Boolean | Produit actif/inactif |
| `promotionId` | String? | ID de promotion (pour évolution future) |
| `createdAt` | DateTime | Date de création |
| `updatedAt` | DateTime | Date de dernière modification |

### ProductCategory (Liaison Produit-Catégorie)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String | Identifiant unique (CUID) |
| `productId` | String | ID du produit |
| `categoryId` | String | ID de la catégorie |
| `createdAt` | DateTime | Date de création |

**Note**: Un produit peut avoir plusieurs catégories (relation many-to-many).

## 💡 Exemples d'utilisation

Consultez le fichier [examples/product-operations.ts](examples/product-operations.ts) pour des exemples complets d'utilisation.

### Créer un produit

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = await prisma.product.create({
  data: {
    name: 'Doliprane 1000mg',
    ean: '3400936404410',
    description: 'Médicament contre la douleur et la fièvre',
    slug: 'doliprane-1000mg',
    imageUrl: 'https://example.com/images/doliprane-1000.jpg',
    brand: 'Sanofi',
    priceHT: 3.50,
    priceTTC: 4.20,
    tva: 20.00,
    stock: 100,
    isActive: true,
  },
});
```

### Rechercher un produit par EAN

```typescript
const product = await prisma.product.findUnique({
  where: {
    ean: '3400936404410',
  },
});
```

### Lister tous les produits actifs

```typescript
const activeProducts = await prisma.product.findMany({
  where: {
    isActive: true,
  },
  include: {
    categories: true,
  },
});
```

### Mettre à jour le stock

```typescript
const updatedProduct = await prisma.product.update({
  where: {
    ean: '3400936404410',
  },
  data: {
    stock: 95,
  },
});
```

### Ajouter des catégories à un produit

```typescript
await prisma.productCategory.create({
  data: {
    productId: product.id,
    categoryId: 'cat_medicaments',
  },
});
```

## 🔍 Prisma Studio

Pour visualiser et modifier vos données graphiquement:

```bash
npx prisma studio
```

Cela ouvrira une interface web sur `http://localhost:5555`

## 🎯 Prochaines étapes

Cette base de données est conçue pour évoluer facilement. Voici ce qui pourra être ajouté plus tard:

- [ ] Modèle `Category` complet avec hiérarchie
- [ ] Modèle `Promotion` pour gérer les offres spéciales
- [ ] Modèle `User` pour les clients
- [ ] Modèle `Order` pour les commandes
- [ ] Modèle `OrderItem` pour les lignes de commande
- [ ] Gestion des avis clients
- [ ] Historique des prix
- [ ] Gestion des fournisseurs

## 📝 Notes importantes

- Le code EAN est **unique** - impossible d'avoir deux produits avec le même EAN
- Le slug est également **unique** pour garantir des URLs uniques
- Les index sont créés sur `ean`, `slug` et `isActive` pour optimiser les performances
- La suppression d'un produit supprime automatiquement ses liaisons de catégories (cascade)
