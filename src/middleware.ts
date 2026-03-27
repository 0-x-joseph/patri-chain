import { type NextMiddleware, NextResponse } from 'next/server';

const middleware: NextMiddleware = (request) => {
    // Check if this is an artisan route
    const pathname = request.nextUrl.pathname;

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

export default middleware;

// Configure which paths should use middleware
export const config = {
    matcher: ['/artisan/:path*'],
};
