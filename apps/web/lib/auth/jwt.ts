import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Generate access token (short-lived)
 * @param payload - User data to encode in token
 * @returns JWT access token
 */
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '15m', // 15 minutes
    });
}

/**
 * Generate refresh token (long-lived)
 * @param payload - User data to encode in token
 * @returns JWT refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '7d', // 7 days
    });
}

/**
 * Verify access token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export function verifyAccessToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Verify refresh token
 * @param token - JWT refresh token to verify
 * @returns Decoded token payload
 */
export function verifyRefreshToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
}

/**
 * Generate both access and refresh tokens
 * @param payload - User data to encode
 * @returns Object with access and refresh tokens
 */
export function generateTokens(payload: TokenPayload): {
    accessToken: string;
    refreshToken: string;
} {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
}
