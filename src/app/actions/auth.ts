'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword, generateRandomToken } from '@/lib/crypto';
import { sendVerificationEmail } from '@/lib/email';
import { sendPhoneVerificationCode, verifyPhoneCode as twilioVerifyCode } from '@/lib/sms';
import { registrationSchema } from '@/lib/validation/registration';
import { cookies } from 'next/headers';

export async function registerUser(
    formData: unknown
): Promise<{ success: boolean; error?: string; userId?: string }> {
    try {
        // Validate input
        const validData = registrationSchema.parse(formData);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validData.email },
        });

        if (existingUser) {
            return { success: false, error: 'Email already registered' };
        }

        // Hash password
        const hashedPassword = hashPassword(validData.password);

        // Generate email verification token
        const emailVerificationToken = generateRandomToken();

        // Create user with email and phone already verified
        const user = await prisma.user.create({
            data: {
                email: validData.email,
                fullName: validData.fullName,
                phoneNumber: validData.phoneNumber,
                password: hashedPassword,
                emailVerified: new Date(), // Auto-verify email
                phoneVerified: new Date(), // Auto-verify phone
                emailVerificationToken: {
                    create: {
                        email: validData.email,
                        token: emailVerificationToken,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                    },
                },
            },
        });

        // Skip email sending for now - verification is auto-enabled

        // Set authentication cookie
        (await cookies()).set('artisanUserId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return { success: true, userId: user.id };
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Registration failed' };
    }
}

export async function resendEmailVerification(email: string): Promise<{ success: boolean; error?: string }> {
    // Email verification is auto-enabled - no action needed
    return { success: true };
}

export async function verifyEmail(email: string, token: string): Promise<{ success: boolean; error?: string }> {
    // Email verification is auto-enabled - no action needed
    return { success: true };
}

export async function requestPhoneVerificationCode(
    userId: string,
    phoneNumber: string
): Promise<{ success: boolean; error?: string }> {
    // Phone verification is auto-enabled - SMS sending skipped
    return { success: true };
}

export async function verifyPhoneCode(
    userId: string,
    phoneNumber: string,
    code: string
): Promise<{ success: boolean; error?: string }> {
    // Phone verification is auto-enabled - no validation needed
    return { success: true };
}

export async function resendPhoneVerificationCode(
    userId: string,
    phoneNumber: string
): Promise<{ success: boolean; error?: string }> {
    // Phone verification is auto-enabled - no action needed
    return { success: true };
}

export async function loginUser(
    email: string,
    password: string
): Promise<{ success: boolean; error?: string; userId?: string; fullName?: string }> {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Verify password
        const { verifyPassword } = await import('@/lib/crypto');
        const isPasswordValid = verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Set authentication cookie
        (await cookies()).set('artisanUserId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return { success: true, userId: user.id, fullName: user.fullName };
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Login failed' };
    }
}

export async function logoutUser(): Promise<{ success: boolean }> {
    try {
        (await cookies()).delete('artisanUserId');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}
