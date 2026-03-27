import type { Metadata } from 'next';
import { LoginPageContent } from '@/components/auth/login-page-content';

export const metadata: Metadata = {
    title: 'Sign In | Patrimoine Heritage',
    description: 'Sign in to your Patrimoine Heritage account',
};

export default function LoginPage() {
    return <LoginPageContent />;
}
