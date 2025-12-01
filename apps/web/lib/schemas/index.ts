import { z } from 'zod';

// Address Schema
export const addressSchema = z.object({
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    company: z.string().optional(),
    addressLine1: z.string().min(1, 'L\'adresse est requise'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'La ville est requise'),
    postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
    country: z.string().default('France'),
    phone: z.string().regex(/^0[1-9]\d{8}$/, 'Numéro de téléphone invalide'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// Login Schema
export const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Shipping Rate Schema
export const shippingRateSchema = z.object({
    minWeight: z.number().min(0, 'Le poids minimum doit être positif'),
    maxWeight: z.number().min(0, 'Le poids maximum doit être positif'),
    price: z.number().min(0, 'Le prix doit être positif'),
}).refine((data) => data.maxWeight > data.minWeight, {
    message: 'Le poids maximum doit être supérieur au poids minimum',
    path: ['maxWeight'],
});

export type ShippingRateFormData = z.infer<typeof shippingRateSchema>;

// Product Schema
export const productSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    description: z.string().optional(),
    priceTTC: z.number().min(0, 'Le prix doit être positif'),
    stock: z.number().int().min(0, 'Le stock doit être positif'),
    weight: z.number().min(0, 'Le poids doit être positif').optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
