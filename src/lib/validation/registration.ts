import { z } from 'zod';

// Moroccan phone number format: +212 or starts with 0
const morrocanPhoneRegex = /^(\+212|0)[1-9]\d{8}$/;

// Password strength requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const registrationSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(50, 'Full name must be less than 50 characters'),
    email: z
        .string()
        .email('Please enter a valid email address'),
    phoneNumber: z
        .string()
        .regex(
            morrocanPhoneRegex,
            'Please enter a valid Moroccan phone number (e.g., +212612345678 or 0612345678)'
        ),
    password: z
        .string()
        .regex(
            passwordRegex,
            'Password must be at least 8 characters with uppercase, lowercase, and numbers'
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
