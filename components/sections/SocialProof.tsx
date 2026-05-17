import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function SocialProof() {
  const s = siteConfig.sections.socialProof;

  return (
    <section id="social-proof" className="border-y border-border/60 bg-card/30 py-8 md:py-10">
      <Container>
        <AnimateIn>
          <p className="text-center text-2xl md:text-3xl font-display tracking-wide mb-8">
            Leurs résultats hier. Les tiens demain.
          </p>
        </AnimateIn>

        {s.stats.length > 0 && (
          <AnimateIn delay={80}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {s.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        )}

        <AnimateIn delay={200}>
          <div className="mt-10 flex justify-center">
            <a
              href={siteConfig.sections.hero.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius)] bg-primary px-7 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Réserve ton bilan offert
            </a>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
