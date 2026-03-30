import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !['approved', 'rejected', 'pending', 'suspended'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { artisanStatus: status },
        });

        return NextResponse.json({ success: true, status: updatedUser.artisanStatus });
    } catch (error) {
        console.error('Failed to update artisan status:', error);
        return NextResponse.json(
            { error: 'Failed to update artisan' },
            { status: 500 }
        );
    }
}