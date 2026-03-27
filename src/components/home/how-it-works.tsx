import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, QrCode, CheckCircle2 } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Register",
        description: "Artisans create an account and verify their identity on Patri-Chain.",
    },
    {
        icon: QrCode,
        title: "Generate QR",
        description: "Products are registered with unique QR codes embedded in blockchain.",
    },
    {
        icon: CheckCircle2,
        title: "Verify Instantly",
        description: "Customers scan QR codes to instantly verify authenticity and provenance.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Three simple steps to protect and verify authentic craftsmanship
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative">
                                {/* Connector line for desktop */}
                                {index < steps.length - 1 && (
                                    <div className="absolute -right-4 top-24 hidden h-0.5 w-8 bg-primary lg:block" />
                                )}

                                <Card className="h-full border-2 border-border hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon className="h-7 w-7 text-primary" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                                {index + 1}
                                            </span>
                                            <CardTitle className="text-xl">{step.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
