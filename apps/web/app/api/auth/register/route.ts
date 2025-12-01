import { NextRequest, NextResponse } from 'next/server';
import { register, type RegisterData } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { email, password, firstName, lastName } = body;
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'Tous les champs obligatoires doivent être remplis' },
                { status: 400 }
            );
        }

        // Parse birthDate if provided
        const birthDate = body.birthDate ? new Date(body.birthDate) : undefined;

        const registerData: RegisterData = {
            email,
            password,
            firstName,
            lastName,
            phone: body.phone,
            gender: body.gender,
            birthDate,
            newsletter: body.newsletter,
        };

        const result = await register(registerData);

        // Set refresh token as httpOnly cookie
        const response = NextResponse.json(
            {
                user: result.user,
                accessToken: result.accessToken,
            },
            { status: 201 }
        );

        response.cookies.set('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription' },
            { status: 400 }
        );
    }
}
