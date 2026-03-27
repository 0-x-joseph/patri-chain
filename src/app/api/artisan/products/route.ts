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
                category: product.category || 'Uncategorized',
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

        const formData = await request.formData();

        // Extract form data
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const materials = formData.get('materials') as string | null;
        const dimensions = formData.get('dimensions') as string | null;
        const productionDate = formData.get('productionDate') as string | null;
        const videoUrl = formData.get('videoUrl') as string | null;

        // Validate required fields
        if (!name || !category || !description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get file names (in production, these would be uploaded to cloud storage)
        const primaryPhoto = formData.get('primaryPhoto') as File | null;
        if (!primaryPhoto) {
            return NextResponse.json(
                { error: 'Primary photo is required' },
                { status: 400 }
            );
        }

        // Create product in database
        const product = await prisma.product.create({
            data: {
                name,
                description,
                artisanId: userId,
                imageUrl: primaryPhoto.name, // In production, this would be a cloud storage URL
                status: 'pending', // New products start as pending
                blockchainStatus: 'pending',
            },
        });

        // In a production app, you would:
        // 1. Upload files to cloud storage (S3, Cloudinary, Uploadcare, etc.)
        // 2. Generate a unique QR code with product details
        // 3. Store additional metadata

        return NextResponse.json({
            success: true,
            productId: product.id,
            qrCode: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-size="12">Product ID: ${product.id.slice(0, 8)}</text></svg>`,
        });
    } catch (error) {
        console.error('Add product API error:', error);
        return NextResponse.json(
            { error: 'Failed to add product' },
            { status: 500 }
        );
    }
}
