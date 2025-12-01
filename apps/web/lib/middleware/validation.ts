import { z } from 'zod';
import { NextRequest } from 'next/server';
import { errorResponse } from '../utils/api-response';

export async function validateRequest<T extends z.ZodType>(
    request: NextRequest,
    schema: T
): Promise<{ valid: true; data: z.infer<T> } | { valid: false; response: Response }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { valid: true, data };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                valid: false,
                response: errorResponse(
                    'Validation error',
                    400,
                    error.issues
                )
            };
        }
        return {
            valid: false,
            response: errorResponse('Invalid request body', 400)
        };
    }
}

// Common validation schemas
export const socialLinksSchema = z.object({
    facebook: z.string().url().optional().nullable(),
    instagram: z.string().url().optional().nullable(),
    twitter: z.string().url().optional().nullable(),
    linkedin: z.string().url().optional().nullable(),
    tiktok: z.string().url().optional().nullable(),
});

export const showcaseUpdateSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        position: z.number().int().min(0),
    })),
});
