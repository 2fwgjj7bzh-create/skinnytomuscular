"use client";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { openForm } from "@/components/forms/QualificationDialog";

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
            <button
              type="button"
              onClick={() => openForm("newsletter")}
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius)] bg-primary px-7 text-base font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Je réserve mon bilan personnalisé offert
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
