import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimateIn } from "@/components/ui/AnimateIn";

function renderHeadline(headline: string, highlight?: string) {
  if (!highlight) return headline;
  const idx = headline.indexOf(highlight);
  if (idx === -1) return headline;
  const before = headline.slice(0, idx);
  const after = headline.slice(idx + highlight.length);
  return (
    <>
      {before}
      <span className="animated-underline">{highlight}</span>
      {after}
    </>
  );
}

export function Hero() {
  const h = siteConfig.sections.hero;

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(50%_60%_at_50%_30%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-radial-fade opacity-40"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {h.liveIndicator && (
            <AnimateIn>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-[#ff0000] animate-blink" />
                  <span className="rounded-full h-2 w-2 bg-[#ff0000]" />
                </span>
                <span>{h.liveIndicator}</span>
              </div>
            </AnimateIn>
          )}

          {h.badge && (
            <AnimateIn>
              <Badge variant="accent" className="mb-6">{h.badge}</Badge>
            </AnimateIn>
          )}

          <AnimateIn delay={80}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.98] text-balance">
              {renderHeadline(h.headline, h.headlineHighlight)}
            </h1>
          </AnimateIn>

          <AnimateIn delay={200}>
            <p className="mt-7 text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto text-pretty">
              {h.subheadline}
            </p>
          </AnimateIn>

          <AnimateIn delay={320}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button cta={h.primaryCta} size="lg" />
              {h.secondaryCta && <Button cta={h.secondaryCta} size="lg" />}
            </div>
          </AnimateIn>

          {h.trustLine && (
            <AnimateIn delay={420}>
              <p className="mt-6 text-sm text-muted">{h.trustLine}</p>
            </AnimateIn>
          )}
        </div>

        {h.visual && h.visual.kind !== "none" && (
          <AnimateIn delay={520}>
            <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
              <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/10">
                {h.visual.kind === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={h.visual.src} alt={h.visual.alt} className="w-full h-auto" />
                )}
                {h.visual.kind === "video" && (
                  <video
                    src={h.visual.src}
                    poster={h.visual.poster}
                    controls
                    playsInline
                    className="w-full h-auto"
                  />
                )}
                {h.visual.kind === "embed" && (
                  <div dangerouslySetInnerHTML={{ __html: h.visual.html }} />
                )}
              </div>
            </div>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
