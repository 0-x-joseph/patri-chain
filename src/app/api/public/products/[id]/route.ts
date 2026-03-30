import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Normalize the ID - trim and convert to lowercase
        const normalizedId = id.trim().toLowerCase();

        const product = await prisma.product.findUnique({
            where: { id: normalizedId },
            include: {
                verifications: {
                    orderBy: { timestamp: 'desc' },
                },
                artisan: {
                    include: {
                        artisanProfile: true,
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Fetch related products from the same region (workshopLocation)
        let relatedProducts = [];
        const workshopLocation = product.artisan?.artisanProfile?.workshopLocation;
        if (workshopLocation) {
            relatedProducts = await prisma.product.findMany({
                where: {
                    id: { not: product.id },
                    status: 'verified',
                    artisan: {
                        artisanProfile: {
                            workshopLocation: workshopLocation,
                        },
                    },
                },
                take: 6,
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            });
        }

        // Add real-time blockchain verification if the product is verified and we have an address configured
        let onChainData = null;
        if (product.blockchainStatus === 'confirmed' && process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS) {
            try {
                const { getProductFromChain } = await import('@/lib/blockchain');
                onChainData = await getProductFromChain(product.id);
            } catch (err) {
                console.error("Failed to query onChain representation:", err);
            }
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
                onChainRecord: onChainData?.exists ? onChainData : null,
                createdAt: product.createdAt,
                artisanId: product.artisanId,
                artisanProfile: product.artisan?.artisanProfile
                    ? {
                        fullName: product.artisan.fullName,
                        profilePhotoUrl: product.artisan.artisanProfile.profilePhotoUrl,
                        workshopLocation: product.artisan.artisanProfile.workshopLocation,
                        craftCategory: product.artisan.artisanProfile.craftCategory,
                        bio: product.artisan.artisanProfile.bio,
                    }
                    : null,
            },
            verifications: product.verifications.map((v: any) => ({
                id: v.id,
                timestamp: v.timestamp,
                status: v.status,
                blockchainTx: v.blockchainTx,
            })),
            relatedProducts,
        });
    } catch (error) {
        console.error('Get public product details API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
        );
    }
}
