# Pharmacie E-Commerce - Monorepo

## 🏗️ Structure du projet

```
SalinesBack/
├── apps/
│   └── web/                    # Next.js App (Frontend + API)
│       ├── app/
│       │   ├── api/
│       │   │   └── products/   # API Products
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── lib/
│       │   └── prisma.ts       # Prisma Client
│       ├── prisma/             # Database Schema
│       └── package.json
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
├── examples/                   # Code examples
└── pnpm-workspace.yaml        # Monorepo config
```

## 🚀 Démarrage rapide

### Installation

```bash
cd /Users/victorpiamias/Desktop/SalinesBack
pnpm install
```

### Lancer le serveur de développement

```bash
cd apps/web
pnpm dev
```

Le site sera accessible sur **http://localhost:3000**

### Prisma Studio (Gestion BDD)

```bash
cd apps/web
npx prisma studio
```

Interface graphique sur **http://localhost:5555**

## 📡 API

### GET /api/products

Récupère la liste des produits actifs avec pagination.

**Endpoint:** `http://localhost:3000/api/products`

**Query Parameters:**
- `limit` (number, default: 20, max: 100) - Nombre de produits par page
- `page` (number, default: 1) - Numéro de la page

**Exemple:**
```bash
curl "http://localhost:3000/api/products?limit=10&page=1"
```

**Réponse:**
```json
{
  "data": [
    {
      "id": "cm...",
      "name": "Doliprane 1000mg",
      "slug": "doliprane-1000mg-8-comprimes",
      "imageUrl": "https://...",
      "priceTTC": 3.00,
      "brands": ["brand_sanofi"],
      "promotionId": null,
      "stock": 150
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**Headers de réponse:**
- `X-RateLimit-Limit`: Limite de requêtes (100)
- `X-RateLimit-Remaining`: Requêtes restantes
- `X-RateLimit-Reset`: Date de réinitialisation

### 🔒 Sécurité

**Rate Limiting:**
- ✅ 100 requêtes par IP toutes les 15 minutes
- ✅ Headers de rate limit dans chaque réponse
- ⚠️ Erreur 429 si limite dépassée

**Pagination:**
- ✅ Maximum 100 produits par requête
- ✅ Validation des paramètres

**Filtres:**
- ✅ Uniquement produits actifs (`isActive: true`)

## 🗄️ Base de données

### Modèles Prisma

- **Product**: Produits de la pharmacie
- **ProductCategory**: Liaison produits ↔ catégories
- **ProductBrand**: Liaison produits ↔ marques

### Commandes Prisma

```bash
cd apps/web

# Générer le client
npx prisma generate

# Créer une migration
npx prisma migrate dev --name nom_migration

# Ouvrir Prisma Studio
npx prisma studio
```

## 📝 Scripts disponibles

```bash
# Depuis apps/web/
pnpm dev          # Lancer Next.js en dev
pnpm build        # Build production
pnpm start        # Lancer en production
pnpm lint         # Linter le code
```

## 🎯 Prochaines étapes

- [ ] Créer les modèles `Brand` et `Category` complets
- [ ] Ajouter d'autres endpoints API (détail produit, recherche, filtres)
- [ ] Créer l'interface frontend
- [ ] Implémenter l'authentification admin
- [ ] Ajouter les commandes et paiements

## 📚 Documentation complète

Consultez le dossier `docs/` pour plus de détails :
- Architecture de la base de données
- Exemples d'utilisation Prisma
- Historique des mises à jour
