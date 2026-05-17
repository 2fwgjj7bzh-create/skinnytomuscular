import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  containerClassName,
  bleed = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("py-10 md:py-14 relative", className)}
    >
      {bleed ? (
        children
      ) : (
        <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  headline,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  headline: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-12 md:mb-16",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className="mb-4">
          <span className="inline-flex items-center text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
        {headline}
      </h2>
      {description && (
        <p className="mt-5 text-lg text-muted leading-relaxed">{description}</p>
      )}
    </div>
  );
}
