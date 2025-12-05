import { NextRequest, NextResponse } from 'next/server';
import { mailService } from '@/lib/services/mail';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email') || 'victor.piamias@gmail.com';

    try {
        const result = await mailService.sendEmail({
            to: email,
            subject: 'Test Email Salines',
            html: '<h1>It Works!</h1><p>Ceci est un email de test.</p>',
            text: 'Ceci est un email de test.',
        });
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Test email error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.response?.data || error.toString()
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const result = await mailService.sendEmail({
            to: email,
            subject: 'Test Email Salines',
            html: '<h1>It Works!</h1><p>Ceci est un email de test.</p>',
            text: 'Ceci est un email de test.',
        });
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Test email error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.response?.data || error.toString()
        }, { status: 500 });
    }
}
