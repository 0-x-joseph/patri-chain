import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Award, Zap } from "lucide-react";

const benefits = [
    {
        icon: Shield,
        title: "Eliminate Counterfeits",
        description: "Blockchain-backed verification ensures only authentic products reach customers.",
    },
    {
        icon: Award,
        title: "Build Trust",
        description: "Documented artisan credentials and product histories increase customer confidence.",
    },
    {
        icon: TrendingUp,
        title: "Increase Value",
        description: "Verified authenticity commands premium prices and loyal customers.",
    },
    {
        icon: Zap,
        title: "Blockchain Proof",
        description: "Immutable records ensure your craftsmanship is permanently verified and protected.",
    },
];

export function ArtisanBenefits() {
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-muted/50">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Benefits for Artisans
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Protect your heritage crafts and build a sustainable business
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
