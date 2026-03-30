import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTASection() {
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-primary">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                    Ready to Protect Your Heritage Crafts?
                </h2>
                <p className="mt-6 text-lg text-primary-foreground/90">
                    Join hundreds of artisans who are already protecting their authenticity with Patri-Chain.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
                    <Link href="/register">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="w-full sm:w-auto gap-2"
                        >
                            Register as an Artisan
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#how-it-works">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                        >
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
