import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Repeat2 } from "lucide-react";

const benefits = [
    {
        icon: Search,
        title: "Verify with Confidence",
        description: "Instantly verify product authenticity by scanning a QR code.",
    },
    {
        icon: MapPin,
        title: "Track Provenance",
        description: "See the complete history and origin of every handcrafted piece.",
    },
    {
        icon: Repeat2,
        title: "Support Resale Confidence",
        description: "Pre-owned items maintain their verified status and value in the secondary market.",
    },
];

export function ClientBenefits() {
    return (
        <section className="py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Benefits for Customers
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Shop with confidence knowing every piece is verified authentic
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
