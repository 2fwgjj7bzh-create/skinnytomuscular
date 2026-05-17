import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  const c = siteConfig.sections.finalCta;

  return (
    <section
      id="cta"
      className={cn(
        "relative overflow-hidden py-14 md:py-20",
        c.dark && "section-dark",
      )}
    >
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(50%_60%_at_50%_50%,black,transparent)]" />
      <div aria-hidden className="absolute inset-0 bg-radial-red-glow opacity-70" />

      <Container className="relative">
        <AnimateIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
              {c.headline}
            </h2>
            <p className="mt-7 text-lg md:text-xl text-muted leading-relaxed text-pretty max-w-2xl mx-auto">
              {c.subheadline}
            </p>
            <div className="mt-10 flex justify-center">
              <div className="rounded-[var(--radius)] animate-pulse-red">
                <Button cta={c.cta} size="lg" />
              </div>
            </div>
            {c.microTrust && (
              <p className="mt-6 text-sm text-muted">{c.microTrust}</p>
            )}
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
