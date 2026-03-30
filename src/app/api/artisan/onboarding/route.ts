import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const userId = await getAuthenticatedUserId();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        // Extract form data
        const dateOfBirth = formData.get('dateOfBirth') as string;
        const gender = formData.get('gender') as string;
        const artisanLicense = formData.get('artisanLicense') as string;
        const craftCategory = formData.get('craftCategory') as string;
        const yearsExperience = parseInt(formData.get('yearsExperience') as string) || 0;
        const workshopLocation = formData.get('workshopLocation') as string;
        const bio = formData.get('bio') as string;
        const socialLinksStr = formData.get('socialLinks') as string;

        // Note: In a production app, you'd upload files to a service like S3, Cloudinary, or Uploadcare
        // For now, we'll just store the file names and document the approach

        let profilePhotos: string[] = [];
        let portfolioPhotos: string[] = [];
        let documentFiles: { [key: string]: string } = {};

        // Profile Photo URL uploaded from frontend using ImageUpload component
        const profilePhotoUrlStr = formData.get('profilePhotoUrl') as string | null;

        // Fallback for old File method
        const profilePhoto = formData.get('profilePhoto') as File | null;
        if (profilePhoto) {
            profilePhotos.push(profilePhoto.name);
        }
        
        const finalProfilePhotoUrl = profilePhotoUrlStr || (profilePhotos.length > 0 ? profilePhotos[0] : null);

        // Portfolio photos
        let idx = 0;
        while (formData.has(`portfolioPhoto${idx}`)) {
            const file = formData.get(`portfolioPhoto${idx}`) as File | null;
            if (file) {
                portfolioPhotos.push(file.name);
            }
            idx++;
        }

        // Documents
        const govId = formData.get('governmentId') as File | null;
        if (govId) documentFiles['governmentId'] = govId.name;

        const artCard = formData.get('artisanCard') as File | null;
        if (artCard) documentFiles['artisanCard'] = artCard.name;

        const workshop = formData.get('workshopPhoto') as File | null;
        if (workshop) documentFiles['workshopPhoto'] = workshop.name;

        // Create or update ArtisanProfile
        const artisanProfile = await prisma.artisanProfile.upsert({
            where: { userId },
            update: {
                profilePhotoUrl: finalProfilePhotoUrl,
                dateOfBirth,
                gender,
                artisanLicense,
                craftCategory,
                yearsExperience,
                workshopLocation,
                bio,
                socialLinks: socialLinksStr,
                portfolioPhotos,
                governmentIdUrl: documentFiles['governmentId'] || null,
                artisanCardUrl: documentFiles['artisanCard'] || null,
                workshopPhotoUrl: documentFiles['workshopPhoto'] || null,
            },
            create: {
                userId,
                profilePhotoUrl: finalProfilePhotoUrl,
                dateOfBirth,
                gender,
                artisanLicense,
                craftCategory,
                yearsExperience,
                workshopLocation,
                bio,
                socialLinks: socialLinksStr,
                portfolioPhotos,
                governmentIdUrl: documentFiles['governmentId'] || null,
                artisanCardUrl: documentFiles['artisanCard'] || null,
                workshopPhotoUrl: documentFiles['workshopPhoto'] || null,
            },
        });

        // Mark onboarding as completed and set status to pending review
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                onboardingCompleted: true,
                artisanStatus: 'pending',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Onboarding submitted successfully',
            userId: user.id,
        });
    } catch (error) {
        console.error('Onboarding API error:', error);
        return NextResponse.json(
            { error: 'Failed to submit onboarding' },
            { status: 500 }
        );
    }
}
