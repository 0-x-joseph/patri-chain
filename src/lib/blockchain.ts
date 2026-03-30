import { ethers } from 'ethers';
import ProductRegistryABI from './ProductRegistry.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS || '';
const RPC_URL = process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';

// Server-side writing to blockchain (using Private Key)
export const getAdminWallet = () => {
    if (!process.env.ADMIN_PRIVATE_KEY) {
        throw new Error('Missing ADMIN_PRIVATE_KEY environment variable. Cannot write to blockchain.');
    }
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
};

export const getContractInstance = (walletOrProvider: ethers.Wallet | ethers.JsonRpcProvider) => {
    // ABI contains nested 'abi' array since it comes from Foundry's JSON output
    return new ethers.Contract(CONTRACT_ADDRESS, ProductRegistryABI.abi || ProductRegistryABI, walletOrProvider);
};

// Write: Register Product on Blockchain
export const registerProductOnChain = async (productId: string, productHash: string, artisanId: string) => {
    // Note: Artisan Address here could be a real metamask address, 
    // but in this MVP we might use a mock address derived from their String ID or just system address
    // We'll use a mocked address based on the UUID since actual metamask integration wasn't set up yet
    const placeholderArtisanAddress = ethers.Wallet.createRandom().address; 

    try {
        const wallet = getAdminWallet();
        const contract = getContractInstance(wallet);

        const tx = await contract.registerProduct(productId, productHash, placeholderArtisanAddress);
        const receipt = await tx.wait();
        
        return {
            success: true,
            txHash: receipt.hash,
            error: null
        };
    } catch (error: any) {
        console.error("Blockchain registration error:", error);
        return {
            success: false,
            txHash: null,
            error: error.message || 'Failed to register product on blockchain'
        };
    }
};

// Read: Get Product info from Blockchain
export const getProductFromChain = async (productId: string) => {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = getContractInstance(provider);
        
        const data = await contract.getProduct(productId);
        
        return {
            exists: data.exists,
            productHash: data.productHash,
            artisan: data.artisan,
            timestamp: Number(data.timestamp),
            error: null
        };
    } catch (error: any) {
        console.error("Blockchain fetch error:", error);
        return {
            exists: false,
            error: error.message || 'Failed to fetch'
        };
    }
};
