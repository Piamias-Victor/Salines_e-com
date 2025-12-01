import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Clear refresh token cookie
        const response = NextResponse.json(
            { message: 'Déconnexion réussie' },
            { status: 200 }
        );

        response.cookies.delete('refreshToken');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la déconnexion' },
            { status: 500 }
        );
    }
}
