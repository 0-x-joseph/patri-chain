import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Fatima Al-Ansari",
        role: "Master Weaver",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
        content: "Patri-Chain has transformed my business. My customers now trust my work completely, and I can charge what my craft is truly worth.",
    },
    {
        name: "Ahmed Ben Ali",
        role: "Leather Craftsman",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
        content: "Finally, a solution that protects artisans from counterfeits. The blockchain verification gives me peace of mind.",
    },
    {
        name: "Zainab Tahasoul",
        role: "Ceramic Artist",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab",
        content: "My international sales have doubled since joining Patri-Chain. Customers are willing to pay premium prices for verified authenticity.",
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-16 sm:py-24 lg:py-32 bg-muted/50">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        What Artisans Say
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Hear from members of the Patri-Chain community
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-foreground mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={testimonial.image} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
