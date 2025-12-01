import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { changePassword } from '@/lib/auth/service';

export async function POST(request: NextRequest) {
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
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Mot de passe actuel et nouveau mot de passe requis' },
                { status: 400 }
            );
        }

        await changePassword(payload.userId, currentPassword, newPassword);

        return NextResponse.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe' },
            { status: 400 }
        );
    }
}
