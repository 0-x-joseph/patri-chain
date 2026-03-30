import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const whereClause = status ? { status: status } : {};

        const products = await prisma.product.findMany({
            where: whereClause,
            include: {
                artisan: {
                    select: {
                        id: true,
                        fullName: true,
                        artisanProfile: {
                            select: {
                                workshopLocation: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format the response
        const formattedProducts = products.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            status: product.status,
            createdAt: product.createdAt,
            artisanName: product.artisan.fullName,
            artisanId: product.artisan.id,
            location: product.artisan.artisanProfile?.workshopLocation
        }));

        return NextResponse.json({ products: formattedProducts });
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve products' },
            { status: 500 }
        );
    }
}