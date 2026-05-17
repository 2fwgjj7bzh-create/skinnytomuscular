import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Merci · ${siteConfig.sections.footer.brand}`,
  description: "Ton appel est confirmé. En attendant, regarde cette vidéo.",
  robots: { index: false, follow: false },
};

export default function MerciPage() {
  const youtubeId = process.env.NEXT_PUBLIC_MERCI_YOUTUBE_ID || "YOUR_VIDEO_ID";
  const isPlaceholder = youtubeId === "YOUR_VIDEO_ID";

  return (
    <main className="min-h-screen bg-background py-16 md:py-24">
      <Container className="max-w-3xl">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-700 mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Appel confirmé
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Bien joué. À très vite.
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            Tu as reçu un mail de confirmation avec le lien du rendez-vous. En attendant,
            regarde cette vidéo — elle te donne une longueur d&apos;avance sur ce qu&apos;on va aborder.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border bg-card aspect-video shadow-xl">
          {isPlaceholder ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center px-6 py-10 bg-card">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ff0000]/10 text-[#ff0000] mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.4-1.9.5-3.8.5-5.8s-.1-3.9-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
                </svg>
              </div>
              <p className="text-sm text-muted max-w-md">
                Configure <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-background">NEXT_PUBLIC_MERCI_YOUTUBE_ID</code> dans <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-background">.env.local</code> avec l&apos;ID de ta vidéo YouTube (la partie après <code>v=</code> dans l&apos;URL).
              </p>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
              title="Vidéo de bienvenue"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-full w-full"
            />
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </Container>
    </main>
  );
}
