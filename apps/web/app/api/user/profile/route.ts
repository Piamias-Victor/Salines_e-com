import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { getUserById, updateProfile, changePassword } from '@/lib/auth/service';

/**
 * Get current user profile
 */
export async function GET(request: NextRequest) {
    try {
        // Get access token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Token d\'authentification manquant' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        // Get user data
        const user = await getUserById(payload.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Token invalide ou expiré' },
            { status: 401 }
        );
    }
}

/**
 * Update user profile
 */
export async function PUT(request: NextRequest) {
    try {
        // Get access token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Token d\'authentification manquant' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        const body = await request.json();

        // Parse birthDate if provided
        if (body.birthDate) {
            body.birthDate = new Date(body.birthDate);
        }

        // Update profile
        const user = await updateProfile(payload.userId, body);

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour' },
            { status: 400 }
        );
    }
}
