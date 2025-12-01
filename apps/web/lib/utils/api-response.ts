import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    details?: any;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
    error: string,
    status = 500,
    details?: any
): NextResponse {
    return NextResponse.json(
        { success: false, error, details },
        { status }
    );
}

export function handleApiError(error: unknown): NextResponse {
    console.error('API Error:', error);

    if (error instanceof Error) {
        return errorResponse(error.message, 500);
    }

    return errorResponse('An unexpected error occurred', 500);
}
