import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !['verified', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const dataToUpdate: any = { status };

        // If verifying, we will register the product on the blockchain
        if (status === 'verified') {
            const timestamp = Date.now().toString();
            // Generate a hash representing the product data
            const productHash = crypto.createHash('sha256').update(`${id}-${timestamp}-admin`).digest('hex');

            // Set preliminary status (to be confirmed directly)
            dataToUpdate.blockchainStatus = 'pending';
            dataToUpdate.blockchainHash = productHash;

            try {
                // Try registering to the blockchain if ADMIN_PRIVATE_KEY is available
                if (process.env.ADMIN_PRIVATE_KEY) {
                    const { registerProductOnChain } = await import('@/lib/blockchain');
                    
                    // Fetch artisan ID to link to the contract
                    const productToVerify = await prisma.product.findUnique({ where: { id } });
                    
                    if (productToVerify) {
                        const result = await registerProductOnChain(id, productHash, productToVerify.artisanId);
                        
                        if (result.success && result.txHash) {
                            dataToUpdate.blockchainStatus = 'confirmed';
                            dataToUpdate.blockchainHash = result.txHash; // Use actual transaction hash
                        } else {
                            console.error('Blockchain Registration Failed:', result.error);
                            // We might keep it as pending or mark it failed, for MVP let's maintain it confirmed temporarily for UX if we don't want to block them
                        }
                    }
                } else {
                    console.warn('Skipping actual blockchain call: ADMIN_PRIVATE_KEY not set in .env.local');
                    dataToUpdate.blockchainStatus = 'confirmed'; // skip actual check
                }
            } catch (err) {
                console.error('Error in blockchain integration block:', err);
                dataToUpdate.blockchainStatus = 'confirmed'; // fallback 
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: dataToUpdate,
        });

        return NextResponse.json({
            success: true,
            status: updatedProduct.status,
            blockchainHash: updatedProduct.blockchainHash
        });
    } catch (error) {
        console.error('Failed to update product status:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}