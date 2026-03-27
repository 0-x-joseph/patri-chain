'use server';

import { prisma } from '@/lib/db';
import { registrationSchema } from '@/lib/validation/registration';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export interface RegisterActionResult {
    success: boolean;
    error?: string;
    message?: string;
    userId?: string;
}

export async function registerAction(
    formData: unknown
): Promise<RegisterActionResult> {
    try {
        // Validate the form data
        const validatedData = registrationSchema.parse(formData);

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email: validatedData.email }, { phoneNumber: validatedData.phoneNumber }],
            },
        });

        if (existingUser) {
            return {
                success: false,
                error: 'Email or phone number already registered',
            };
        }

        // Hash password (in production, use bcrypt)
        const hashedPassword = Buffer.from(validatedData.password).toString('base64');

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                fullName: validatedData.fullName,
                phoneNumber: validatedData.phoneNumber,
                password: hashedPassword,
            },
        });

        // Generate email verification token
        const emailToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.emailVerificationToken.create({
            data: {
                email: user.email,
                token: emailToken,
                expiresAt: tokenExpiry,
                userId: user.id,
            },
        });

        // Send verification email
        await sendVerificationEmail(user.email, emailToken, user.fullName);

        return {
            success: true,
            message: 'Registration successful. Verification email sent.',
            userId: user.id,
        };
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: false,
            error: 'An unexpected error occurred during registration',
        };
    }
}

export async function requestPhoneVerificationCodeAction(
    userId: string,
    phoneNumber: string
): Promise<RegisterActionResult> {
    try {
        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete existing token if any
        await prisma.phoneVerificationToken.deleteMany({
            where: { userId },
        });

        // Create new phone verification token
        await prisma.phoneVerificationToken.create({
            data: {
                phone: phoneNumber,
                code,
                expiresAt,
                userId,
            },
        });

        // In production, send via SMS service (Twilio)
        console.log(`[SMS] Phone: ${phoneNumber}, Code: ${code}`);

        return {
            success: true,
            message: 'Verification code sent to your phone',
        };
    } catch (error) {
        console.error('Phone verification request error:', error);
        return {
            success: false,
            error: 'Failed to request phone verification code',
        };
    }
}
