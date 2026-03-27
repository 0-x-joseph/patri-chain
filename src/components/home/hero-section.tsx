import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 sm:py-32 lg:py-40">
            {/* Moroccan pattern background */}
            <div className="absolute inset-0 opacity-5">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                    <pattern id="moroccan" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="10" cy="10" r="3" fill="currentColor" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#moroccan)" />
                </svg>
            </div>

            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Preserve Moroccan Craftsmanship.{" "}
                        <span className="text-primary">Prove Authenticity.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Patri-Chain uses blockchain technology to protect heritage artisans and
                        empower consumers with verified proof of authenticity for every handcrafted piece.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
                        <Button size="lg" className="gap-2">
                            Start Protecting Your Craft
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            Verify a Product
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
