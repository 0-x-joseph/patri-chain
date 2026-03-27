import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Normalize the ID - trim and convert to lowercase
        const normalizedId = productId.trim().toLowerCase();

        // Fetch the product
        const product = await prisma.product.findUnique({
            where: { id: normalizedId },
            select: {
                id: true,
                status: true,
                name: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        // Only allow verification for approved products
        if (product.status !== 'verified') {
            return NextResponse.json(
                { message: `Cannot verify ${product.status} products. Product must be approved.` },
                { status: 403 }
            );
        }

        // Create a scan hash (unique identifier for this verification event)
        const scanHash = crypto.randomBytes(16).toString('hex');

        // Create the verification record
        const verification = await prisma.productVerification.create({
            data: {
                productId,
                scanHash,
                status: 'pending',
            },
        });

        // Increment the verification count on the product
        await prisma.product.update({
            where: { id: productId },
            data: {
                verificationCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                verification: {
                    id: verification.id,
                    scanHash: verification.scanHash,
                    timestamp: verification.timestamp,
                    status: verification.status,
                },
                message: 'Product verification recorded successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating verification:', error);
        return NextResponse.json(
            { message: 'Failed to create verification' },
            { status: 500 }
        );
    }
}
