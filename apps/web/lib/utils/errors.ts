/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
    constructor(
        message: string,
        public fields?: Record<string, string>
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Handle API errors and return user-friendly messages
 */
export function handleApiError(error: unknown): string {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (error instanceof ValidationError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Une erreur inattendue s\'est produite';
}

/**
 * Log error to console in development
 */
export function logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
        console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    }
}
