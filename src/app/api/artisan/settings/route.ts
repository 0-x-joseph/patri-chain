import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            fullName: user.fullName || '',
            email: user.email,
            phoneNumber: user.phoneNumber || '',
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { message: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { fullName, phoneNumber, currentPassword, newPassword } = body;

        // If changing password, validate current password
        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return NextResponse.json(
                    { message: 'Current password is incorrect' },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            return NextResponse.json({
                message: 'Password updated successfully',
            });
        }

        // Update profile information
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(fullName && { fullName }),
                ...(phoneNumber && { phoneNumber }),
            },
        });

        return NextResponse.json({
            message: 'Settings updated successfully',
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { message: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
