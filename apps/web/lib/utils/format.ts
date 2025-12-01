// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format price in euros
 */
export function formatPrice(price: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        ...options,
    }).format(price);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(original: number, discounted: number): number {
    return Math.round(((original - discounted) / original) * 100);
}

// ============================================================================
// String Formatting
// ============================================================================

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Create slug from text
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date to French locale
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        ...options,
    }).format(dateObj);
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj > new Date();
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate EAN code
 */
export function isValidEAN(ean: string): boolean {
    return /^\d{13}$/.test(ean);
}

// ============================================================================
// Class Names
// ============================================================================

/**
 * Conditionally join class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
