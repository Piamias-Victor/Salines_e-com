import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Get the first (and only) social links record
        let socialLinks = await prisma.socialLinks.findFirst();

        // If no record exists, create one with empty values
        if (!socialLinks) {
            socialLinks = await prisma.socialLinks.create({
                data: {
                    facebook: null,
                    instagram: null,
                    twitter: null,
                    linkedin: null,
                    tiktok: null,
                },
            });
        }

        return NextResponse.json(socialLinks);
    } catch (error) {
        console.error('Error fetching social links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch social links' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { facebook, instagram, twitter, linkedin, tiktok } = body;

        // Get the first record or create it
        let socialLinks = await prisma.socialLinks.findFirst();

        if (!socialLinks) {
            socialLinks = await prisma.socialLinks.create({
                data: {
                    facebook: facebook || null,
                    instagram: instagram || null,
                    twitter: twitter || null,
                    linkedin: linkedin || null,
                    tiktok: tiktok || null,
                },
            });
        } else {
            socialLinks = await prisma.socialLinks.update({
                where: { id: socialLinks.id },
                data: {
                    facebook: facebook || null,
                    instagram: instagram || null,
                    twitter: twitter || null,
                    linkedin: linkedin || null,
                    tiktok: tiktok || null,
                },
            });
        }

        return NextResponse.json(socialLinks);
    } catch (error) {
        console.error('Error updating social links:', error);
        return NextResponse.json(
            { error: 'Failed to update social links' },
            { status: 500 }
        );
    }
}
