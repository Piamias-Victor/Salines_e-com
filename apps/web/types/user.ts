// ========================================
// TYPES LOCAUX - PAS D'IMPORT PRISMA
// ========================================
// Définition locale des enums Prisma pour éviter les problèmes sur Vercel

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN'
}

// Interface User complète
export interface User {
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    birthDate: Date | null;
    phone: string | null;
    emailVerified: boolean;
    verificationToken: string | null;
    isActive: boolean;
    role: UserRole;
    newsletter: boolean;
    language: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
}
