import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const whereClause = status ? { artisanStatus: status } : {};

        const artisans = await prisma.user.findMany({
            where: whereClause,
            include: {
                artisanProfile: true,
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format the response securely (no passwords)
        const formattedArtisans = artisans.map((user: any) => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            status: user.artisanStatus,
            createdAt: user.createdAt,
            profile: user.artisanProfile,
            productCount: user._count.products
        }));

        return NextResponse.json({ artisans: formattedArtisans });
    } catch (error) {
        console.error('Failed to fetch artisans:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve artisans' },
            { status: 500 }
        );
    }
}