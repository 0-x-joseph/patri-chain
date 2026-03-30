import { Separator } from "@/components/ui/separator";
import { Share2, Heart, MessageSquare, Users, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = {
    company: [
        { label: "About", href: "/" },
        { label: "How It Works", href: "/#how-it-works" },
        { label: "Blog", href: "/" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/" },
        { label: "Terms of Service", href: "/" },
        { label: "Cookie Policy", href: "/" },
    ],
    contact: [
        { label: "Support", href: "/" },
        { label: "Contact Us", href: "mailto:hello@patrichain.com" },
        { label: "Partnerships", href: "/" },
    ],
};

const socialLinks = [
    { icon: Share2, href: "/", label: "Share" },
    { icon: Heart, href: "/", label: "Like" },
    { icon: MessageSquare, href: "/", label: "Message" },
    { icon: Users, href: "/", label: "Follow" },
];

export function Footer() {
    return (
        <footer id="contact" className="bg-muted/50 border-t border-border">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Main Footer Content */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Patri-Chain</h3>
                        <p className="text-sm text-muted-foreground">
                            Protecting heritage craftsmanship through blockchain authenticity.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {socialLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        aria-label={link.label}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Contact</h4>
                        <ul className="space-y-2">
                            {footerLinks.contact.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground mb-3">Email us:</p>
                            <a
                                href="mailto:hello@patrichain.com"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                hello@patrichain.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <Separator className="my-8" />

                {/* Bottom Footer */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Patri-Chain. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Proudly supporting Moroccan artisans and heritage craftsmanship.
                    </p>
                </div>
            </div>
        </footer>
    );
}
