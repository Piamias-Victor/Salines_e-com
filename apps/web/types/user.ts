// Types locaux pour remplacer les imports Prisma qui posent problème sur Vercel
import { Gender, UserRole } from '@prisma/client';

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
