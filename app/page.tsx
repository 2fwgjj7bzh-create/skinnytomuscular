import { siteConfig } from "@/config/site";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { Features } from "@/components/sections/Features";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { Marquee } from "@/components/ui/Marquee";

export default function HomePage() {
  const s = siteConfig.sections;
  return (
    <main className="relative">
      {s.hero.enabled && <Hero />}
      <Marquee />
      {s.socialProof.enabled && <SocialProof />}
      {s.testimonials.enabled && <Testimonials />}
      {s.problem.enabled && <Problem />}
      {s.solution.enabled && <Solution />}
      {s.features.enabled && <Features />}
      {s.pricing.enabled && <Pricing />}
      {s.faq.enabled && <FAQ />}
      {s.finalCta.enabled && <FinalCTA />}
      {s.footer.enabled && <Footer />}
    </main>
  );
}
