import { type NextMiddleware, NextResponse } from 'next/server';

const proxy: NextMiddleware = (request) => {
    const pathname = request.nextUrl.pathname;

    // Admin routes protection
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const adminUserId = request.cookies.get('adminUserId')?.value;

        if (!adminUserId) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Artisan routes protection
    if (pathname.startsWith('/artisan')) {
        // Get the artisan user ID from cookies
        const userId = request.cookies.get('artisanUserId')?.value;

        // If not authenticated, redirect to login
        if (!userId) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
};

export default proxy;

// Configure which paths should use proxy
export const config = {
    matcher: ['/artisan/:path*', '/admin/:path*'],
};
