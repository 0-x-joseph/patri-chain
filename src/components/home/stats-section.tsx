const stats = [
    { label: "Artisans Onboarded", value: "1,250+" },
    { label: "Products Protected", value: "18,500+" },
    { label: "Verifications Performed", value: "42,300+" },
];

export function StatsSection() {
    return (
        <section className="py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-3">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold text-primary">
                                {stat.value}
                            </div>
                            <p className="mt-2 text-lg text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
