import { NextResponse } from 'next/server';
import { syncWinPharmaProducts } from '@/lib/winpharma/sync';

export const maxDuration = 300; // 5 minutes timeout for Vercel

export async function GET(request: Request) {
    try {
        // Optional: Add a secret key check for security
        // const { searchParams } = new URL(request.url);
        // if (searchParams.get('key') !== process.env.CRON_SECRET) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const result = await syncWinPharmaProducts();

        return NextResponse.json({
            success: true,
            message: 'Sync completed',
            stats: result
        });
    } catch (error: any) {
        console.error('Sync failed:', error);
        return NextResponse.json(
            { error: 'Sync failed', details: error.message },
            { status: 500 }
        );
    }
}
