import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword, validatePassword } from './password';
import { generateTokens, type TokenPayload } from './jwt';
import type { User } from '@prisma/client';

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    birthDate?: Date;
    newsletter?: boolean;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
}

/**
 * Register a new user
 * @param data - Registration data
 * @returns User data and tokens
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('Format d\'email invalide');
    }

    // Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
        throw new Error('Un compte existe déjà avec cet email');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
        data: {
            email: data.email.toLowerCase(),
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            gender: data.gender,
            birthDate: data.birthDate,
            newsletter: data.newsletter || false,
        },
    });

    // Generate tokens
    const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        ...tokens,
    };
}

/**
 * Login a user
 * @param data - Login credentials
 * @returns User data and tokens
 */
export async function login(data: LoginData): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
    });

    if (!user) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // Check if account is active
    if (!user.isActive) {
        throw new Error('Ce compte a été désactivé');
    }

    // Verify password
    if (!user.password) {
        throw new Error('Ce compte utilise une connexion externe');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // Update last login
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        ...tokens,
    };
}

/**
 * Get user by ID
 * @param userId - User ID
 * @returns User data without password
 */
export async function getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Update user profile
 * @param userId - User ID
 * @param data - Profile data to update
 * @returns Updated user data
 */
export async function updateProfile(
    userId: string,
    data: Partial<Omit<User, 'id' | 'email' | 'password' | 'createdAt' | 'updatedAt'>>
): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Change user password
 * @param userId - User ID
 * @param currentPassword - Current password
 * @param newPassword - New password
 */
export async function changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<void> {
    // Get user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || !user.password) {
        throw new Error('Utilisateur non trouvé');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
}
