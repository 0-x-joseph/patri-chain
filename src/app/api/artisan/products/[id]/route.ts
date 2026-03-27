import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserId } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getAuthenticatedUserId();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                verifications: {
                    orderBy: { timestamp: 'desc' },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Verify ownership
        if (product.artisanId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                status: product.status,
                imageUrl: product.imageUrl,
                verificationCount: product.verifications.length,
                blockchainStatus: product.blockchainStatus,
                blockchainHash: product.blockchainHash,
                createdAt: product.createdAt,
            },
            verifications: product.verifications.map((v: any) => ({
                id: v.id,
                timestamp: v.timestamp,
                status: v.status,
                blockchainTx: v.blockchainTx,
            })),
        });
    } catch (error) {
        console.error('Get product details API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
        );
    }
}
