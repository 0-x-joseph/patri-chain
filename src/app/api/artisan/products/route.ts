import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const userId = await getAuthenticatedUserId();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const products = await prisma.product.findMany({
            where: { artisanId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                verifications: {
                    select: { id: true },
                },
            },
        });

        return NextResponse.json({
            products: products.map((product: any) => ({
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
                status: product.status,
                verificationCount: product.verifications.length,
                blockchainStatus: product.blockchainStatus,
                createdAt: product.createdAt,
            })),
        });
    } catch (error) {
        console.error('Get products API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getAuthenticatedUserId();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse JSON body instead of FormData
        const body = await request.json();

        const {
            name,
            description,
            price,
            materials,
            dimensions,
            productionDate,
            videoUrl,
            imageUrl,
            additionalImages,
        } = body;

        // Validate required fields
        if (!name || !description || !imageUrl) {
            return NextResponse.json(
                { error: 'Missing required fields: name, description, imageUrl' },
                { status: 400 }
            );
        }

        // Create product in database
        const product = await prisma.product.create({
            data: {
                name,
                description,
                artisanId: userId,
                imageUrl, // Use the Cloudinary URL directly
                status: 'pending', // New products start as pending
                blockchainStatus: 'pending',
            },
        });

        // In a production app, you would:
        // 1. Store additional images metadata in database
        // 2. Generate a unique QR code with product details
        // 3. Store additional metadata (category, price, etc.)

        return NextResponse.json({
            success: true,
            productId: product.id,
            qrCode: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-size="12">Product ID: ${product.id.slice(0, 8)}</text></svg>`,
        });
    } catch (error) {
        console.error('Add product API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to add product' },
            { status: 500 }
        );
    }
}
