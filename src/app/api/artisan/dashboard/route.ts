import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        // Get userId from authenticated session
        const userId = await getAuthenticatedUserId();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Fetch user's products
        const products = await prisma.product.findMany({
            where: { artisanId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                verifications: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        });

        // Calculate stats
        const allProducts = await prisma.product.findMany({
            where: { artisanId: userId },
        });

        const allVerifications = await prisma.productVerification.findMany({
            where: {
                product: {
                    artisanId: userId,
                },
            },
        });

        // Fetch recent verifications
        const recentVerifications = await prisma.productVerification.findMany({
            where: {
                product: {
                    artisanId: userId,
                },
            },
            orderBy: { timestamp: 'desc' },
            take: 5,
            include: {
                product: true,
            },
        });

        return NextResponse.json({
            user: {
                fullName: user.fullName,
                email: user.email,
            },
            stats: {
                totalProducts: allProducts.length,
                totalVerifications: allVerifications.length,
                accountStatus: user.emailVerified && user.phoneVerified ? 'Active' : 'Pending',
            },
            recentProducts: products.map((product: any) => ({
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
                status: product.status,
                verificationCount: product.verifications.length,
                blockchainStatus: product.blockchainStatus,
            })),
            recentVerifications: recentVerifications.map((verification: any) => ({
                id: verification.id,
                productName: verification.product.name,
                timestamp: verification.timestamp.toISOString(),
                status: verification.status,
                blockchainTx: verification.blockchainTx,
            })),
        });
    } catch (error) {
        console.error('Dashboard API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
