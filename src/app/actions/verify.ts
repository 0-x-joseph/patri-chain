'use server';

import { prisma } from '@/lib/db';

export interface VerifyActionResult {
    success: boolean;
    error?: string;
    message?: string;
}

export async function verifyEmailAction(
    token: string
): Promise<VerifyActionResult> {
    try {
        // Find the verification token
        const verificationToken = await prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verificationToken) {
            return {
                success: false,
                error: 'Invalid or expired token',
            };
        }

        // Check if token has expired
        if (verificationToken.expiresAt < new Date()) {
            await prisma.emailVerificationToken.delete({
                where: { id: verificationToken.id },
            });

            return {
                success: false,
                error: 'Token has expired. Please request a new verification email.',
            };
        }

        // Mark email as verified
        await prisma.user.update({
            where: { id: verificationToken.userId! },
            data: { emailVerified: new Date() },
        });

        // Delete the token
        await prisma.emailVerificationToken.delete({
            where: { id: verificationToken.id },
        });

        return {
            success: true,
            message: 'Email verified successfully',
        };
    } catch (error) {
        console.error('Email verification error:', error);
        return {
            success: false,
            error: 'Failed to verify email',
        };
    }
}

export async function verifyPhoneCodeAction(
    userId: string,
    code: string
): Promise<VerifyActionResult> {
    try {
        // Find the phone verification token
        const phoneToken = await prisma.phoneVerificationToken.findUnique({
            where: { userId },
        });

        if (!phoneToken) {
            return {
                success: false,
                error: 'No phone verification requested',
            };
        }

        // Check if token has expired
        if (phoneToken.expiresAt < new Date()) {
            await prisma.phoneVerificationToken.delete({
                where: { id: phoneToken.id },
            });

            return {
                success: false,
                error: 'Code has expired. Please request a new one.',
            };
        }

        // Check if code is correct
        if (phoneToken.code !== code) {
            // Increment attempts
            await prisma.phoneVerificationToken.update({
                where: { id: phoneToken.id },
                data: { attempts: phoneToken.attempts + 1 },
            });

            // Lock account after 5 failed attempts
            if (phoneToken.attempts >= 4) {
                await prisma.phoneVerificationToken.delete({
                    where: { id: phoneToken.id },
                });

                return {
                    success: false,
                    error: 'Too many failed attempts. Please request a new code.',
                };
            }

            return {
                success: false,
                error: `Invalid code. ${5 - (phoneToken.attempts + 1)} attempts remaining.`,
            };
        }

        // Mark phone as verified
        await prisma.user.update({
            where: { id: userId },
            data: { phoneVerified: new Date() },
        });

        // Delete the token
        await prisma.phoneVerificationToken.delete({
            where: { id: phoneToken.id },
        });

        return {
            success: true,
            message: 'Phone verified successfully',
        };
    } catch (error) {
        console.error('Phone verification error:', error);
        return {
            success: false,
            error: 'Failed to verify phone',
        };
    }
}

export async function resendEmailVerificationAction(
    userId: string
): Promise<VerifyActionResult> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }

        // Delete existing token
        await prisma.emailVerificationToken.deleteMany({
            where: { userId },
        });

        // Generate new token
        const crypto = await import('crypto');
        const token = crypto.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.emailVerificationToken.create({
            data: {
                email: user.email,
                token,
                expiresAt,
                userId,
            },
        });

        // Send email
        const { sendVerificationEmail } = await import('@/lib/email');
        await sendVerificationEmail(user.email, token, user.fullName);

        return {
            success: true,
            message: 'Verification email sent',
        };
    } catch (error) {
        console.error('Resend email verification error:', error);
        return {
            success: false,
            error: 'Failed to resend verification email',
        };
    }
}
