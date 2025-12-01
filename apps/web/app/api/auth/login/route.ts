import { NextRequest, NextResponse } from 'next/server';
import { login, type LoginData } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { email, password } = body;
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        const loginData: LoginData = { email, password };
        const result = await login(loginData);

        // Set refresh token as httpOnly cookie
        const response = NextResponse.json({
            user: result.user,
            accessToken: result.accessToken,
        });

        response.cookies.set('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de la connexion' },
            { status: 401 }
        );
    }
}
