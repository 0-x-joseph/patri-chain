import { cookies } from 'next/headers';

/**
 * Get the authenticated artisan user ID from cookies
 * Used in server components and API routes
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('artisanUserId')?.value || null;
}

/**
 * Get the artisan user from database
 * Requires authenticated session
 */
export async function getAuthenticatedUser() {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        return null;
    }

    const { prisma } = await import('@/lib/prisma');
    return prisma.user.findUnique({
        where: { id: userId },
    });
}
