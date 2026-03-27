import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
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

        // Return public product information regardless of authentication
        // All products are accessible for public verification
        return NextResponse.json({
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category || 'Uncategorized',
                status: product.status,
                imageUrl: product.imageUrl,
                verificationCount: product.verifications.length,
                blockchainStatus: product.blockchainStatus,
                blockchainHash: product.blockchainHash,
                createdAt: product.createdAt,
                artisanId: product.artisanId,
            },
            verifications: product.verifications.map((v: any) => ({
                id: v.id,
                timestamp: v.timestamp,
                status: v.status,
                blockchainTx: v.blockchainTx,
            })),
        });
    } catch (error) {
        console.error('Get public product details API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
        );
    }
}
