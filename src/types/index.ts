/**
 * Common types used throughout the application
 */

export type Status = 'verified' | 'invalid' | 'pending' | 'blockchain';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'artisan' | 'admin' | 'user';
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    status: Status;
    artisanId: string;
}

export interface Artisan {
    id: string;
    name: string;
    bio?: string;
    craft: string;
    products: Product[];
    status: Status;
    verified: boolean;
    avatar?: string;
}

export interface ValidationResponse {
    isValid: boolean;
    message: string;
    details?: Record<string, any>;
}
