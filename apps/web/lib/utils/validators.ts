/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (French format)
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^0[1-9]/.test(cleaned);
}

/**
 * Validate postal code (French format)
 */
export function isValidPostalCode(postalCode: string): boolean {
    return /^\d{5}$/.test(postalCode);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate required field
 */
export function isRequired(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Validate number range
 */
export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}
