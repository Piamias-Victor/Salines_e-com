// Re-export Prisma enums for use throughout the app
export { Gender, UserRole } from '@prisma/client';

// Local User type definition to avoid Prisma Client import issues on Vercel
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

// Type aliases for Prisma enums (fallback if import fails)
type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
type UserRole = 'CUSTOMER' | 'ADMIN';
