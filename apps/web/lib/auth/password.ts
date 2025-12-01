import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match
 */
export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validatePassword(password: string): {
    isValid: boolean;
    error?: string;
} {
    if (password.length < 8) {
        return {
            isValid: false,
            error: 'Le mot de passe doit contenir au moins 8 caractères',
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            error: 'Le mot de passe doit contenir au moins une majuscule',
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            error: 'Le mot de passe doit contenir au moins une minuscule',
        };
    }

    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            error: 'Le mot de passe doit contenir au moins un chiffre',
        };
    }

    return { isValid: true };
}
