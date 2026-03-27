import { Metadata } from 'next';
import { WaitingApprovalContent } from '@/components/artisan/waiting-approval-content';

export const metadata: Metadata = {
    title: 'Waiting for Approval | Patrimoine',
    description: 'Your artisan account is pending admin approval',
};

export default function WaitingApprovalPage() {
    return <WaitingApprovalContent />;
}
