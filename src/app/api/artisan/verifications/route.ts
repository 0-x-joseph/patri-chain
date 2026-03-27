import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get all product verifications for user's products
        const verifications = await prisma.productVerification.findMany({
            where: {
                product: {
                    artisanId: user.id,
                },
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        const formattedVerifications = verifications.map((v: any) => ({
            id: v.id,
            productId: v.productId,
            productName: v.product.name,
            scanHash: v.scanHash,
            timestamp: v.timestamp,
            blockchainTx: v.blockchainTx,
            status: v.status,
        }));

        return NextResponse.json({
            verifications: formattedVerifications,
        });
    } catch (error) {
        console.error('Error fetching verifications:', error);
        return NextResponse.json(
            { message: 'Failed to fetch verifications' },
            { status: 500 }
        );
    }
}
