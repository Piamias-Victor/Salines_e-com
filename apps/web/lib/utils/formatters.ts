/**
 * Format a price in euros
 */
export function formatPrice(price: number | string | null | undefined): string {
    if (price === null || price === undefined) return '0,00 €';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0,00 €';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(numPrice);
}

/**
 * Format a weight in kilograms
 */
export function formatWeight(weight: number | string | null | undefined): string {
    if (weight === null || weight === undefined) return '0 kg';
    const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight;
    if (isNaN(numWeight)) return '0 kg';
    return `${numWeight.toFixed(3)} kg`;
}

/**
 * Format a date
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (format === 'short') {
        return new Intl.DateTimeFormat('fr-FR').format(dateObj);
    }

    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
}

/**
 * Format a phone number
 */
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)} %`;
}
