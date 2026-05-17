import { siteConfig } from "@/config/site";
import { Section, SectionHeader } from "@/components/ui/Section";
import { AnimateIn } from "@/components/ui/AnimateIn";

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const t = siteConfig.sections.testimonials;

  return (
    <Section id="testimonials">
      <SectionHeader eyebrow={t.eyebrow} headline={t.headline} />

      <div className="grid gap-5 md:grid-cols-3">
        {t.testimonials.map((tm, i) => (
          <AnimateIn key={tm.name} delay={i * 80}>
            <figure className="h-full flex flex-col rounded-[var(--radius)] border border-border bg-card overflow-hidden">
              {tm.photos && (
                <div className="relative flex h-56 w-full">
                  <div className="relative flex-1 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tm.photos.before}
                      alt={`${tm.name} — avant`}
                      className="h-full w-full object-cover object-top"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80">
                      Avant
                    </span>
                  </div>
                  <div className="w-px bg-border/60" />
                  <div className="relative flex-1 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tm.photos.after}
                      alt={`${tm.name} — après`}
                      className="h-full w-full object-cover object-top"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-accent/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      Après
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-col flex-1 p-6">
                {tm.result && (
                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                    {tm.result}
                  </div>
                )}
                <blockquote className="text-base leading-relaxed text-foreground/90 flex-1">
                  &ldquo;{tm.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {!tm.photos && tm.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tm.photo}
                      alt={tm.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : !tm.photos ? (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent/40 to-accent/10 text-xs font-semibold text-accent">
                      {initials(tm.name)}
                    </span>
                  ) : null}
                  <div>
                    <div className="text-sm font-semibold">{tm.name}</div>
                    <div className="text-xs text-muted">{tm.role}</div>
                  </div>
                </figcaption>
              </div>
            </figure>
          </AnimateIn>
        ))}
      </div>
    </Section>
  );
}
