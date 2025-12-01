// App Constants
export const APP_NAME = 'Salines Pharmacie';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// API Configuration
export const API_CONFIG = {
    ENDPOINTS: {
        BANNERS: '/api/banners',
        PRODUCTS: '/api/products',
        CATEGORIES: '/api/categories',
        BRANDS: '/api/brands',
        CART: '/api/cart',
        SHIPPING: '/api/shipping',
        ORDERS: '/api/orders',
        PROMOTIONS: '/api/promotions',
    },
    LIMITS: {
        BANNERS: 10,
        PRODUCTS: 20,
        CATEGORIES: 50,
        BRANDS: 10,
        PROMOTIONS: 10,
        FEATURED_CATEGORIES: 12,
        FEATURED_BRANDS: 10,
    },
} as const;

// Shipping
export const FREE_SHIPPING_THRESHOLD = 50; // Default threshold in euros
export const DEFAULT_SHIPPING_COST = 4.9;

// Cart
export const MAX_CART_ITEMS = 50;
export const CART_COOKIE_NAME = 'cart_session';
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Images
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Delivery Types
export const DELIVERY_TYPES = {
    PHARMACY: 'PHARMACY',
    HOME: 'HOME',
    RELAY: 'RELAY',
} as const;

export const DELIVERY_TYPE_LABELS = {
    PHARMACY: 'Retrait en Pharmacie',
    HOME: 'Livraison à Domicile',
    RELAY: 'Point Relais',
} as const;

// Order Status
export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
} as const;

export const ORDER_STATUS_LABELS = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    PROCESSING: 'En préparation',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
} as const;

// Product Types
export const PRODUCT_TYPES = {
    MEDICAMENT: 'MEDICAMENT',
    PARAPHARMACIE: 'PARAPHARMACIE',
} as const;

// Regex Patterns
export const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^0[1-9]\d{8}$/,
    POSTAL_CODE: /^\d{5}$/,
} as const;

// UI Configuration
export const UI_CONFIG = {
    CAROUSEL: {
        SCROLL_AMOUNT: 300,
        AUTO_SCROLL_INTERVAL: 5000,
    },
} as const;
