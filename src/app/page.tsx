'use client';

import {
  NavbarWrapper,
  HeroSection,
  HowItWorks,
  ArtisanBenefits,
  ClientBenefits,
  Testimonials,
  StatsSection,
  FinalCTASection,
  Footer,
} from "@/components/home";

export default function Home() {
  return (
    <>
      <NavbarWrapper />
      <main className="min-h-screen flex flex-col">
        <HeroSection />
        <HowItWorks />
        <ArtisanBenefits />
        <ClientBenefits />
        <Testimonials />
        <StatsSection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}
