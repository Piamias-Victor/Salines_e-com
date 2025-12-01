// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
    LIMITS: {
        FEATURED_BRANDS: 10,
        FEATURED_CATEGORIES: 10,
        FEATURED_PRODUCTS: 20,
        PROMOTIONS: 10,
        BANNERS: 5,
    },
    ENDPOINTS: {
        BRANDS: '/api/brands',
        CATEGORIES: '/api/categories',
        PRODUCTS: '/api/products',
        PROMOTIONS: '/api/promotions',
        BANNERS: '/api/banners',
    },
} as const;

// ============================================================================
// UI Configuration
// ============================================================================

export const UI_CONFIG = {
    CAROUSEL: {
        SCROLL_AMOUNT: 300,
        AUTO_SCROLL_INTERVAL: 5000,
    },
    ANIMATION: {
        DURATION: 300,
        EASING: 'ease-in-out',
    },
    BREAKPOINTS: {
        SM: 640,
        MD: 768,
        LG: 1024,
        XL: 1280,
    },
} as const;

// ============================================================================
// Theme Configuration
// ============================================================================

export const THEME = {
    COLORS: {
        PRIMARY: '#fe0090',
        SECONDARY: '#fef000',
        TEXT: '#3f4c53',
        BACKGROUND: '#f9fafb',
        WHITE: '#ffffff',
        BLACK: '#000000',
    },
    SHADOWS: {
        SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        MD: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        LG: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        XL: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
} as const;

// ============================================================================
// Business Rules
// ============================================================================

export const BUSINESS_RULES = {
    MIN_STOCK_ALERT: 10,
    MAX_CART_QUANTITY: 99,
    FREE_SHIPPING_THRESHOLD: 50,
    TVA_RATES: {
        STANDARD: 20.0,
        REDUCED: 5.5,
        SUPER_REDUCED: 2.1,
    },
} as const;
