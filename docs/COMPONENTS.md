# Pharmacy Storefront UI - Component Structure

## 📁 Architecture Atomique

```
components/
├── atoms/                  # Composants de base réutilisables
│   ├── Button.tsx         # Bouton avec variants (primary, secondary, ghost)
│   └── Input.tsx          # Input avec focus ring
│
├── molecules/             # Combinaisons d'atoms
│   ├── SearchBar.tsx      # Barre de recherche avec icône
│   ├── CartButton.tsx     # Bouton panier avec badge compteur
│   ├── UserButton.tsx     # Bouton compte utilisateur
│   └── Logo.tsx           # Logo cliquable
│
└── organisms/             # Composants complexes
    ├── AnnouncementBar.tsx # Bandeau défilant
    └── Navbar.tsx         # Navigation responsive
```

## 🎨 Design System

### Couleurs
- **Primary (#fe0090)** : Rose/Magenta - CTA et boutons principaux
- **Secondary (#fef000)** : Jaune - Accents et highlights
- **Accent (#3f4c53)** : Gris foncé - Texte et navbar
- **Background (#fff5f8)** : Rose pastel - Fond de page

### Composants

#### Atoms

**Button**
- Variants : `primary`, `secondary`, `ghost`
- Sizes : `sm`, `md`, `lg`
- Support d'icônes Lucide
- Animations : hover + active scale

**Input**
- Focus ring rose (#fe0090)
- Option `fullWidth`
- Transitions fluides

#### Molecules

**SearchBar**
- Icône de recherche (Lucide)
- Placeholder : "Rechercher un produit..."
- Visuel uniquement (fonctionnalité à venir)

**CartButton**
- Icône panier
- Badge compteur (actuellement 0)
- Variant ghost

**UserButton**
- Icône utilisateur
- Variant ghost

**Logo**
- Texte : "Pharmacie des Salines"
- Hover effect rose
- Lien vers homepage

#### Organisms

**AnnouncementBar**
- Message : "Livraison Offerte dès 49€ d'achats"
- Animation de défilement infini (20s)
- Fond rose (#fe0090)
- Texte blanc

**Navbar**
- Layout : Logo (gauche) | SearchBar (centre) | Actions (droite)
- Sticky top
- Responsive :
  - Desktop : Tout visible
  - Mobile : Burger menu
- Shadow subtile

## 📱 Responsive

### Desktop (md+)
- Navbar horizontale complète
- SearchBar centrée
- Icônes à droite

### Mobile
- Logo + Burger menu
- Menu déroulant avec :
  - SearchBar
  - Icônes (panier + compte)

## 🎯 Règles de code

✅ **Respectées :**
- Architecture atomique (atoms → molecules → organisms)
- Aucun fichier > 100 lignes
- Composants fragmentés et réutilisables
- Clean code avec TypeScript
- Tailwind pour le styling
- Mobile-first approach

## 🚀 Utilisation

```tsx
import { Button } from '@/components/atoms/Button';
import { SearchBar } from '@/components/molecules/SearchBar';
import { Navbar } from '@/components/organisms/Navbar';

// Exemple Button
<Button variant="primary" size="md">
  Acheter
</Button>

// Exemple avec icône
<Button variant="secondary" icon={ShoppingCart}>
  Ajouter au panier
</Button>
```

## 📝 Prochaines étapes

- [ ] Ajouter fonctionnalité recherche
- [ ] Implémenter panier
- [ ] Créer page produit
- [ ] Ajouter authentification
- [ ] Footer
- [ ] Pages catégories
