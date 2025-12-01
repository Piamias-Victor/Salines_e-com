// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
    error: string;
    status?: number;
}

export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: ApiError };

// ============================================================================
// Request Types
// ============================================================================

export interface FetchOptions {
    limit?: number;
    offset?: number;
    cache?: RequestCache;
    revalidate?: number;
    params?: Record<string, string | number | boolean>;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface PaginationQuery {
    limit?: string;
    offset?: string;
}

export interface FilterQuery extends PaginationQuery {
    search?: string;
    category?: string;
    brand?: string;
}
