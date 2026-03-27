import { Progress } from '@/components/ui/progress';

export function PasswordStrengthIndicator({ password }: { password: string }) {
    const getStrength = (pwd: string): number => {
        if (!pwd) return 0;
        let strength = 0;

        // Length
        if (pwd.length >= 8) strength += 25;
        if (pwd.length >= 12) strength += 10;

        // Character types
        if (/[a-z]/.test(pwd)) strength += 15;
        if (/[A-Z]/.test(pwd)) strength += 15;
        if (/\d/.test(pwd)) strength += 15;
        if (/[^a-zA-Z\d]/.test(pwd)) strength += 15;

        return Math.min(strength, 100);
    };

    const getStrengthColor = (strength: number): string => {
        if (strength < 20) return 'bg-destructive';
        if (strength < 40) return 'bg-orange-500';
        if (strength < 60) return 'bg-yellow-500';
        if (strength < 80) return 'bg-blue-500';
        return 'bg-primary';
    };

    const getStrengthText = (strength: number): string => {
        if (strength < 20) return 'Very weak';
        if (strength < 40) return 'Weak';
        if (strength < 60) return 'Fair';
        if (strength < 80) return 'Good';
        return 'Strong';
    };

    const strength = getStrength(password);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                    Password strength
                </label>
                <span className={`text-xs font-medium ${strength < 20 ? 'text-destructive' :
                        strength < 40 ? 'text-orange-500' :
                            strength < 60 ? 'text-yellow-500' :
                                strength < 80 ? 'text-blue-500' :
                                    'text-primary'
                    }`}>
                    {getStrengthText(strength)}
                </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                    className={`h-full ${getStrengthColor(strength)} transition-all duration-300`}
                    style={{ width: `${strength}%` }}
                />
            </div>
        </div>
    );
}
