import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            onboardingCompleted: user.onboardingCompleted,
            artisanStatus: user.artisanStatus,
            fullName: user.fullName,
            email: user.email,
        });
    } catch (error) {
        console.error('Get profile API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
