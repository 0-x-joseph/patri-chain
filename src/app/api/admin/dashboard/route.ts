import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Minimal auth check would go here for MVP

        const [
            totalArtisans,
            pendingArtisans,
            totalProducts,
            pendingProducts,
            totalVerifications
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { artisanStatus: 'pending' } }),
            prisma.product.count(),
            prisma.product.count({ where: { status: 'pending' } }),
            prisma.productVerification.count()
        ]);

        return NextResponse.json({
            metrics: {
                totalArtisans,
                pendingArtisans,
                totalProducts,
                pendingProducts,
                totalVerifications
            }
        });
    } catch (error) {
        console.error('Failed to fetch admin dashboard metrics:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve metrics' },
            { status: 500 }
        );
    }
}