import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Get refresh token from cookie
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Token de rafraîchissement manquant' },
                { status: 401 }
            );
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        // Generate new access token
        const accessToken = generateAccessToken({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        });

        return NextResponse.json({ accessToken });
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { error: 'Token de rafraîchissement invalide ou expiré' },
            { status: 401 }
        );
    }
}
