/**
 * Color palette based on guides.md
 * Defines all colors used throughout the application for light and dark modes
 */

export const COLORS = {
    light: {
        // Primary and UI Elements
        primary: '#166534', // Green
        primaryHover: '#15803D', // Darker Green
        background: '#FFFFFF',
        foreground: '#171717', // Black
        card: '#FFFFFF',
        border: '#E5E7EB', // Light Gray
        input: '#E5E7EB',

        // Status and Feedback
        success: '#166534', // Green (Verified)
        error: '#B91C1C', // Red (Invalid)
        warning: '#F59E0B', // Amber
        info: '#3B82F6', // Blue

        // Text
        textPrimary: '#171717',
        textSecondary: '#6B7280', // Gray
        textMuted: '#9CA3AF',
    },
    dark: {
        // Primary and UI Elements
        primary: '#4ADE80', // Light Green
        primaryHover: '#86EFAC', // Lighter Green
        background: '#1A1A1A',
        foreground: '#F5F5F5', // Light
        card: '#262626',
        border: '#374151', // Dark Gray
        input: '#262626',

        // Status and Feedback
        success: '#4ADE80', // Light Green (Verified)
        error: '#F87171', // Light Red (Invalid)
        warning: '#FBBF24', // Light Amber
        info: '#60A5FA', // Light Blue

        // Text
        textPrimary: '#F5F5F5',
        textSecondary: '#9CA3AF', // Gray
        textMuted: '#6B7280',
    },
};

/**
 * Component guidelines from guides.md
 */
export const COMPONENT_GUIDELINES = {
    button: 'primary', // Uses primary color
    badge: {
        verified: '#166534',
        invalid: '#B91C1C',
        pending: '#F59E0B',
        blockchain: '#3B82F6',
    },
    toast: {
        success: '#166534',
        error: '#B91C1C',
        info: '#3B82F6',
    },
};

/**
 * Layout components to be used
 */
export const LAYOUTS = {
    artisan: 'ArtisanLayout', // Sidebar with dashboard, products, settings
    admin: 'AdminLayout', // Sidebar with pending, artisans, analytics, settings
    public: 'PublicLayout', // Minimal header/footer for verification pages
    auth: 'AuthLayout', // Centered card layout for auth pages
};
