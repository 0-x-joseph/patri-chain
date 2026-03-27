import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Link2 } from 'lucide-react';

type StatusType = 'verified' | 'invalid' | 'pending' | 'blockchain';

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

/**
 * StatusBadge - Displays status with appropriate color and icon
 * Based on guides.md color guidelines
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
    const statusConfig: Record<StatusType, { bg: string; icon: React.ReactNode; label: string }> = {
        verified: {
            bg: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            icon: <Check className="w-4 h-4" />,
            label: 'Verified',
        },
        invalid: {
            bg: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
            icon: <X className="w-4 h-4" />,
            label: 'Invalid',
        },
        pending: {
            bg: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            icon: <Clock className="w-4 h-4" />,
            label: 'Pending',
        },
        blockchain: {
            bg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            icon: <Link2 className="w-4 h-4" />,
            label: 'Blockchain',
        },
    };

    const config = statusConfig[status];

    return (
        <Badge variant="outline" className={`gap-2 flex items-center ${config.bg} ${className}`}>
            {config.icon}
            <span>{config.label}</span>
        </Badge>
    );
}
