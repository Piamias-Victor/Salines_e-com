import { ApiError, logError } from './errors';

interface FetchOptions extends RequestInit {
    timeout?: number;
}

/**
 * Enhanced fetch wrapper with error handling and timeout
 */
export async function apiClient<T = any>(
    url: string,
    options: FetchOptions = {}
): Promise<T> {
    const { timeout = 10000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new ApiError(
                error.message || error.error || 'Erreur réseau',
                response.status,
                error.code
            );
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('La requête a expiré', 408);
        }

        logError(error, `API Call: ${url}`);
        throw new ApiError('Erreur de connexion au serveur');
    }
}

/**
 * GET request helper
 */
export async function get<T = any>(url: string, options?: FetchOptions): Promise<T> {
    return apiClient<T>(url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T = any>(
    url: string,
    data?: any,
    options?: FetchOptions
): Promise<T> {
    return apiClient<T>(url, {
        ...options,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
    });
}

/**
 * PUT request helper
 */
export async function put<T = any>(
    url: string,
    data?: any,
    options?: FetchOptions
): Promise<T> {
    return apiClient<T>(url, {
        ...options,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
    });
}

/**
 * DELETE request helper
 */
export async function del<T = any>(url: string, options?: FetchOptions): Promise<T> {
    return apiClient<T>(url, { ...options, method: 'DELETE' });
}
